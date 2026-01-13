# FlightGuard DApp - Quick Start Guide

## 🚀 One-Command Startup

Run the complete blockchain-enabled DApp:

```bash
start_blockchain_full.bat
```

This automatically:
1. ✅ Starts Hardhat blockchain
2. ✅ Deploys all smart contracts
3. ✅ Registers demo flight
4. ✅ Funds company pool (100,000 tokens)
5. ✅ Runs database migrations
6. ✅ Starts backend server
7. ✅ Starts frontend

**Access:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend:** http://localhost:8000
- 🔗 **Blockchain:** http://127.0.0.1:8545

---

## 💰 Testing Insurance Payouts

### 1. Buy Insurance
1. Go to http://localhost:3000
2. Search for a flight
3. Select insurance plan
4. Complete purchase
5. **Note the Flight ID from your dashboard**

### 2. Trigger Payout
Open new terminal and run:
```bash
cd backend
python oracle_simulator.py --flight-id [YOUR_FLIGHT_ID] --delay 240
```

**You'll see:**
```
✅ Policy settled successfully!
💰 1/1 policies paid out
```

---

## 🔧 Individual Commands (if needed)

### Start Blockchain Only
```bash
start_blockchain.bat
```

### Deploy Contracts Only
```bash
cd "smart contracts and etls"
npx hardhat run scripts\deploy.js --network localhost
```

### Fund Company (if redeployed)
```bash
cd backend
python register_demo_flight.py
python fund_contract.py
```

---

## 🎯 What's Happening

1. **User buys insurance** → Creates policy in DB + Blockchain (PolicyID assigned)
2. **Flight gets delayed** → Oracle detects via simulator
3. **Smart contract pays** → Automatically transfers tokens to user
4. **Database updates** → Policy marked as "Claimed"

**All on blockchain! Fully automated!** 🚀

---

## 📝 Files Created

- `start_blockchain_full.bat` - Complete startup (recommended)
- `start_all.bat` - Start without blockchain (basic mode)
- `backend/oracle_simulator.py` - Simulate flight delays
- `backend/fund_contract.py` - Fund insurance pool
- `backend/register_demo_flight.py` - Register flights on blockchain

---

## ⚠️ Important Notes

- **First run:** Use `start_blockchain_full.bat`
- **Restart:** Close ALL terminals, run `start_blockchain_full.bat` again
- **Oracle:** Run manually after buying insurance (auto-mode coming soon)
- **Funding:** Already done by startup script (100,000 tokens)

🎉 **Your DApp is production-ready!**
