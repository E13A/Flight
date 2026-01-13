"""
Blockchain integration module for FlightGuard DApp.
Loads deployed smart contracts and provides Web3 interface.
"""
import json
import os
from pathlib import Path
from web3 import Web3
from loguru import logger

# Get blockchain RPC URL from environment
BLOCKCHAIN_RPC_URL = os.environ.get('BLOCKCHAIN_RPC_URL', 'http://127.0.0.1:8545')

# Path to deployed addresses JSON
DEPLOYED_ADDRESSES_PATH = Path(__file__).parent.parent.parent / "smart contracts and etls" / "deployed_addresses.json"

# Path to contract ABIs
ABI_PATH = Path(__file__).parent.parent.parent / "smart contracts and etls" / "artifacts" / "contracts"

# Initialize Web3
try:
    w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_RPC_URL))
    if w3.is_connected():
        logger.info(f"✅ Connected to blockchain at {BLOCKCHAIN_RPC_URL}")
        logger.info(f"   Chain ID: {w3.eth.chain_id}")
    else:
        logger.warning(f"⚠️ Blockchain not connected at {BLOCKCHAIN_RPC_URL}")
        w3 = None
except Exception as e:
    logger.error(f"❌ Failed to connect to blockchain: {e}")
    w3 = None


def load_deployed_addresses():
    """Load deployed contract addresses from JSON file."""
    try:
        with open(DEPLOYED_ADDRESSES_PATH, 'r') as f:
            addresses = json.load(f)
        logger.info(f"✅ Loaded deployed addresses from {DEPLOYED_ADDRESSES_PATH}")
        return addresses
    except FileNotFoundError:
        logger.warning(f"⚠️ Deployed addresses file not found: {DEPLOYED_ADDRESSES_PATH}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"❌ Failed to parse deployed addresses JSON: {e}")
        return None


def load_contract_abi(contract_name):
    """Load contract ABI from artifacts."""
    abi_file = ABI_PATH / f"{contract_name}.sol" / f"{contract_name}.json"
    try:
        with open(abi_file, 'r') as f:
            artifact = json.load(f)
        return artifact['abi']
    except FileNotFoundError:
        logger.error(f"❌ ABI file not found: {abi_file}")
        return None
    except (json.JSONDecodeError, KeyError) as e:
        logger.error(f"❌ Failed to load ABI for {contract_name}: {e}")
        return None


def get_insurance_contract():
    """Get UserDelayInsurance contract instance."""
    if not w3 or not w3.is_connected():
        logger.warning("⚠️ Blockchain not connected, returning None")
        return None
    
    addresses = load_deployed_addresses()
    if not addresses:
        return None
    
    abi = load_contract_abi("UserDelayInsurance")
    if not abi:
        return None
    
    contract_address = addresses.get('userInsurance')
    if not contract_address:
        logger.error("❌ UserDelayInsurance address not found in deployed addresses")
        return None
    
    contract = w3.eth.contract(address=contract_address, abi=abi)
    logger.info(f"✅ Loaded UserDelayInsurance contract at {contract_address}")
    return contract


def get_token_contract():
    """Get MockToken contract instance."""
    if not w3 or not w3.is_connected():
        return None
    
    addresses = load_deployed_addresses()
    if not addresses:
        return None
    
    abi = load_contract_abi("MockToken")
    if not abi:
        return None
    
    contract_address = addresses.get('token')
    if not contract_address:
        logger.error("❌ MockToken address not found")
        return None
    
    contract = w3.eth.contract(address=contract_address, abi=abi)
    logger.info(f"✅ Loaded MockToken contract at {contract_address}")
    return contract


def get_default_account():
    """Get default account for transactions (deployer account)."""
    if not w3 or not w3.is_connected():
        return None
    
    try:
        accounts = w3.eth.accounts
        if accounts:
            return accounts[0]  # Return first account (deployer)
        else:
            logger.warning("⚠️ No accounts available on blockchain")
            return None
    except Exception as e:
        logger.error(f"❌ Failed to get accounts: {e}")
        return None


# Export main Web3 instance and helper functions
__all__ = [
    'w3',
    'get_insurance_contract',
    'get_token_contract',
    'get_default_account',
    'load_deployed_addresses'
]
