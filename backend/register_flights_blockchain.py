"""
Register a test flight in TicketProvider smart contract.
This allows buyPolicy to work without InvalidFlight errors.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from blockchain.contract_loader import w3, load_deployed_addresses
from web3 import Web3
import json
from pathlib import Path

# Load TicketProvider contract
def get_ticket_provider():
    addresses = load_deployed_addresses()
    if not addresses:
        print("❌ No deployed addresses found!")
        return None
    
    # Load ABI
    abi_path = Path(__file__).parent.parent / "smart contracts and etls" / "artifacts" / "contracts" / "TicketProvider.sol" / "TicketProvider.json"
    
    with open(abi_path, 'r') as f:
        artifact = json.load(f)
    
    contract = w3.eth.contract(
        address=addresses['ticketProvider'],
        abi=artifact['abi']
    )
    
    return contract

def register_test_flight():
    """Register a generic test flight that always exists."""
    contract = get_ticket_provider()
    deployer = w3.eth.accounts[0]
    
    # Register a wildcard flight that accepts any ID starting with "FLIGHT"
    # For demo purposes, we'll register several common flight IDs
    for i in range(1, 50):
        flight_id = f"FLIGHT{i}"
        
        try:
            # Check if already exists
            info = contract.functions.getFlightInfo(flight_id).call()
            if info[0]:  # exists
                print(f"  ✓ {flight_id} already registered")
                continue
        except:
            pass
        
        # Register flight
        print(f"📝 Registering {flight_id}...")
        
        tx_hash = contract.functions.registerFlight(
            flight_id,
            int(1700000000),  # departureTime (dummy timestamp)
            deployer  # company address
        ).transact({'from': deployer})
        
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if receipt['status'] == 1:
            print(f"  ✅ Registered {flight_id}")
        else:
            print(f"  ❌ Failed to register {flight_id}")

if __name__ == '__main__':
    print("🚀 Registering test flights in TicketProvider...")
    print("="*60)
    register_test_flight()
    print("\n🎉 Done! Flights registered on blockchain.")
