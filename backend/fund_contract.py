"""Fund CompanyFunding contract with tokens for payouts"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from blockchain.contract_loader import w3, load_deployed_addresses, get_token_contract
import json
from pathlib import Path

addresses = load_deployed_addresses()
token = get_token_contract()
deployer = w3.eth.accounts[0]

# Load CompanyFunding contract
abi_path = Path(__file__).parent.parent / "smart contracts and etls" / "artifacts" / "contracts" / "CompanyFunding.sol" / "CompanyFunding.json"
with open(abi_path, 'r') as f:
    company_funding_abi = json.load(f)['abi']

company_funding = w3.eth.contract(
    address=addresses['companyFunding'],
    abi=company_funding_abi
)

# Fund amount: 100,000 tokens
funding_amount = w3.to_wei(100000, 'ether')

print(f"💰 Funding company pool with 100,000 tokens...")
print(f"   Company (deployer): {deployer}")
print(f"   CompanyFunding contract: {addresses['companyFunding']}")

# Step 1: Approve CompanyFunding to spend tokens
print(f"\n🔓 Approving CompanyFunding to spend tokens...")
approve_tx = token.functions.approve(
    addresses['companyFunding'],
    funding_amount
).transact({'from': deployer})
w3.eth.wait_for_transaction_receipt(approve_tx)
print(f"✅ Approval granted!")

# Step 2: Call fundCompany to deposit into company balance
print(f"\n📝 Depositing tokens into company balance...")
fund_tx = company_funding.functions.fundCompany(funding_amount).transact({'from': deployer})
receipt = w3.eth.wait_for_transaction_receipt(fund_tx)

if receipt['status'] == 1:
    print(f"✅ Company pool funded successfully!")
    print(f"   TX: {fund_tx.hex()}")
    
    # Check company balance
    balance = company_funding.functions.companyBalances(deployer).call()
    print(f"   Company balance: {w3.from_wei(balance, 'ether')} tokens")
    print(f"\n🎉 Company can now pay insurance claims!")
else:
    print("❌ Funding failed!")
