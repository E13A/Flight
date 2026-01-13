"""Quick script to register DEMO_FLIGHT"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from blockchain.contract_loader import w3, load_deployed_addresses
import json
from pathlib import Path

addresses = load_deployed_addresses()
abi_path = Path(__file__).parent.parent / "smart contracts and etls" / "artifacts" / "contracts" / "TicketProvider.sol" / "TicketProvider.json"

with open(abi_path, 'r') as f:
    abi = json.load(f)['abi']

contract = w3.eth.contract(address=addresses['ticketProvider'], abi=abi)
deployer = w3.eth.accounts[0]

# Grant COMPANY_ROLE to deployer so we can register flights
print("🔧 Granting COMPANY_ROLE to deployer...")
company_role = contract.functions.COMPANY_ROLE().call()
tx = contract.functions.grantRole(company_role, deployer).transact({'from': deployer})
w3.eth.wait_for_transaction_receipt(tx)
print("✅ Role granted!")

print("📝 Registering DEMO_FLIGHT...")
tx = contract.functions.registerFlight('DEMO_FLIGHT', 1700000000).transact({'from': deployer})
receipt = w3.eth.wait_for_transaction_receipt(tx)

if receipt['status'] == 1:
    print("✅ DEMO_FLIGHT registered successfully!")
    print("\n🎉 Now book insurance on the website and it will work!")
else:
    print("❌ Failed to register DEMO_FLIGHT")
