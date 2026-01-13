import json
import os
import time
from typing import Dict, Any, List

from web3 import Web3
from web3._utils.events import get_event_data

from etl.logger import get_logger
from etl.db import init_engine_and_session, get_session, OnchainEvent
from etl.mapper import map_event

logger = get_logger("etl.listener")


class ContractBinding:
    def __init__(self, name: str, address: str, abi: List[Dict[str, Any]]):
        self.name = name
        self.address = Web3.to_checksum_address(address)
        self.abi = abi

        # Build event ABI map: topic -> (event_name, abi)
        self.event_abis = []
        for item in abi:
            if item.get("type") == "event":
                self.event_abis.append(item)


def load_config() -> Dict[str, Any]:
    config_path = os.path.join(
        os.path.dirname(__file__), "config", "deployment.json"
    )
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_bindings(w3: Web3, config: Dict[str, Any]) -> List[ContractBinding]:
    base_dir = os.path.dirname(__file__)
    abi_dir = os.path.join(base_dir, "abi")

    bindings: List[ContractBinding] = []
    for name, address in config["contracts"].items():
        abi_path = os.path.join(abi_dir, f"{name}.json")
        with open(abi_path, "r", encoding="utf-8") as f:
            artifact = json.load(f)
        abi = artifact["abi"]
        bindings.append(ContractBinding(name, address, abi))
        logger.info(f"Loaded ABI for {name} at {address}")
    return bindings


def decode_log(w3: Web3, binding: ContractBinding, log: Dict[str, Any]) -> Dict[str, Any] | None:
    # Try each event ABI until one matches
    for ev_abi in binding.event_abis:
        try:
            # Build a temporary contract just for decoding
            tmp_contract = w3.eth.contract(abi=[ev_abi])
            decoded = get_event_data(w3.codec, ev_abi, log)
            return decoded
        except Exception:
            continue
    return None


def process_logs_for_block_range(
    w3: Web3, bindings: List[ContractBinding], start_block: int, end_block: int
):
    session = get_session()
    try:
        addresses = [b.address for b in bindings]
        logs = w3.eth.get_logs(
            {
                "fromBlock": start_block,
                "toBlock": end_block,
                "address": addresses,
            }
        )

        logger.info(
            f"Fetched {len(logs)} logs from blocks [{start_block}, {end_block}]",
            extra={"extra": {"count": len(logs)}},
        )

        for log in logs:
            addr = Web3.to_checksum_address(log["address"])
            binding = next((b for b in bindings if b.address == addr), None)
            if binding is None:
                continue

            decoded = decode_log(w3, binding, log)
            if decoded is None:
                continue

            event_name = decoded["event"]
            tx_hash = decoded["transactionHash"].hex()
            block_number = decoded["blockNumber"]
            log_index = decoded["logIndex"]

            payload = map_event(binding.name, decoded)

            evt = OnchainEvent(
                contract_name=binding.name,
                contract_address=binding.address,
                event_name=event_name,
                tx_hash=tx_hash,
                block_number=block_number,
                log_index=log_index,
                payload=payload,
            )

            try:
                session.add(evt)
                session.commit()
            except Exception as e:
                session.rollback()
                # Likely duplicate (idempotency), or DB constraint
                logger.info(
                    f"Skipping duplicate or failed insert for {tx_hash}@{log_index}: {e}"
                )

    finally:
        session.close()


def run_live_listener():
    cfg = load_config()
    rpc_url = cfg.get("rpc_url", "http://127.0.0.1:8545")

    w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not w3.is_connected():
        raise RuntimeError(f"Cannot connect to RPC at {rpc_url}")

    init_engine_and_session()
    bindings = load_bindings(w3, cfg)

    latest_block = w3.eth.block_number
    logger.info(f"Starting live listener from block {latest_block}")

    last_processed = latest_block

    poll_interval_sec = 3

    while True:
        current = w3.eth.block_number
        if current > last_processed:
            start = last_processed + 1
            end = current
            process_logs_for_block_range(w3, bindings, start, end)
            last_processed = current
        time.sleep(poll_interval_sec)


if __name__ == "__main__":
    run_live_listener()
