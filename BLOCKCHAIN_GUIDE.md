# 🔗 Blockchain Quick Start Guide

## Setup (First Time Only)

### 1. Install Dependencies
```bash
cd "smart contracts and etls"
npm install
```

---

## Daily Usage

### Step 1: Start Blockchain Node
**Open Terminal 1:**
```bash
# Double-click:
start_blockchain.bat

# OR manually:
cd "smart contracts and etls"
npx hardhat node
```

**You'll see:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

⚠️ **Keep this terminal open!** This is your local blockchain.

### Step 2: Deploy Contracts
**Open Terminal 2:**
```bash
# Double-click:
deploy_contracts.bat

# OR manually:
cd "smart contracts and etls"
npx hardhat run scripts\deploy.js --network localhost
```

**You'll see:**
```
✅ Contract addresses saved to: deployed_addresses.json
🪙 Distributing tokens to test accounts...
  ✅ Sent 10,000 tokens to 0x3C44...
  ...
🎉 DEPLOYMENT COMPLETE
```

### Step 3: Start Backend + Frontend (As Usual)
```bash
# Backend terminal:
cd backend
venv\Scripts\activate
uvicorn config.asgi:app --host 0.0.0.0 --port 8000 --reload

# Frontend terminal:
cd frontend  
npm run dev
```

---

## Quick Reference

### Blockchain Details
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Network Name**: Hardhat Local

### Deployed Contracts
Check `smart contracts and etls/deployed_addresses.json` for addresses.

### Test Accounts
Hardhat provides 20 accounts with 10,000 ETH each:
- Account #0 (Deployer): `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Account #1 (Oracle): `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Account #2 (Treasury): `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- etc.

---

## Using MetaMask (Optional)

### Add Hardhat Network:
1. Open MetaMask
2. Networks → Add Network → Add Manually
3. Enter:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

### Import Test Account:
1. Get private key from Hardhat terminal output
2. MetaMask → Import Account → Enter private key
3. Now you have 10,000 ETH to test with!

---

## Smart Contract Functions

### UserDelayInsurance
```solidity
buyPolicy(
  flightId,
  ticketId, 
  bookingId,
  delayThresholdMinutes,
  premiumAmount,
  payoutAmount
)

settlePolicy(policyId, actualDelayMinutes) // Oracle only
```

### CompanyFunding
```solidity
fundCompany(amount) // Airline adds liquidity
payCompensation(company, user, policyId, amount) // Insurance contract calls
```

---

## Troubleshooting

### "Error: connect ECONNREFUSED"
➡️ Blockchain node not running. Start `start_blockchain.bat`

### "Error: network does not exist"
➡️ Deploy contracts first with `deploy_contracts.bat`

### Contracts not responding
➡️ Blockchain restarted? Redeploy contracts (they're in memory only)

---

## Important Notes

⚠️ **Blockchain is NOT persistent!**
- When you stop Hardhat node, all blockchain data is lost
- You must redeploy contracts each time you restart
- Database persists (SQLite) but blockchain doesn't

💡 **When to Restart**:
- Restart blockchain: When you close the terminal or Ctrl+C
- Redeploy contracts: Every time blockchain restarts
- Backend/Frontend: Can restart anytime, just reconnect

---

## Next Steps

1. ✅ Start blockchain
2. ✅ Deploy contracts  
3. 🔜 Connect backend to blockchain
4. 🔜 Test policy purchase flow
5. 🔜 Test oracle settlement

**You're ready to use real smart contracts locally!** 🚀
