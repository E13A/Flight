import json
import os
from typing import Dict, Any, List

from web3 import Web3

from etl.logger import get_logger
from etl.db import init_engine_and_session
from etl.listener import load_bindings, process_logs_for_block_range

logger = get_logger("etl.backfill")


def load_config() -> Dict[str, Any]:
    config_path = os.path.join(
        os.path.dirname(__file__), "config", "deployment.json"
    )
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def run_backfill():
    cfg = load_config()
    rpc_url = cfg.get("rpc_url", "http://127.0.0.1:8545")

    w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not w3.is_connected():
        raise RuntimeError(f"Cannot connect to RPC at {rpc_url}")

    init_engine_and_session()
    bindings = load_bindings(w3, cfg)

    deployment_block = cfg.get("deployment_block", 0)
    latest_block = w3.eth.block_number

    logger.info(
        f"Starting backfill from block {deployment_block} to {latest_block}"
    )

    step = 100  # process in ranges of 100 blocks
    start = deployment_block
    while start <= latest_block:
        end = min(start + step - 1, latest_block)
        process_logs_for_block_range(w3, bindings, start, end)
        start = end + 1

    logger.info("Backfill complete")


if __name__ == "__main__":
    run_backfill()
