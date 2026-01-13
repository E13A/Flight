# FlightGuard DApp - Complete Setup Guide

## 🚀 Quick Start (3 Steps)

```bash
# 1. Clone the repository
git clone <repository-url>
cd flightguard-dapp

# 2. Run automated setup
setup.bat

# 3. Start the application
start_blockchain_full.bat
```

**That's it!** The app will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Blockchain: http://127.0.0.1:8545

---

## 📋 Prerequisites

Before running `setup.bat`, ensure you have:

### Required Software
- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **Python** 3.10 or higher ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))

### Verify Installation
```bash
node --version   # Should show v18+ 
python --version # Should show 3.10+
git --version    # Any recent version
```

---

## 🔧 What `setup.bat` Does

The automated setup script will:

1. ✅ Verify Node.js and Python are installed
2. ✅ Install frontend dependencies (React, Next.js, etc.)
3. ✅ Install Hardhat and blockchain tools
4. ✅ Create Python virtual environment
5. ✅ Install backend dependencies (Django, FastAPI, Web3)
6. ✅ Create necessary directories (logs, security)

**Total time:** ~5-10 minutes depending on internet speed

---

## 🎯 What `start_blockchain_full.bat` Does

The startup script automatically:

1. Starts local Hardhat blockchain (Ethereum testnet)
2. Deploys all 5 smart contracts
3. Registers demo flight on blockchain
4. Funds insurance pool with 100,000 tokens
5. Runs database migrations
6. Starts backend API server
7. Starts frontend web server

**Everything is automated!** Just wait for "ALL SERVICES STARTED" message.

---

## 🌐 Accessing the Application

Once started, open your browser:

- **Main App**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **GraphQL**: http://localhost:8000/graphql
- **Admin Panel**: http://localhost:8000/admin

---

## 💡 Common Issues & Solutions

### Issue: "Node.js not found"
**Solution:** Install Node.js from https://nodejs.org/ and restart terminal

### Issue: "Python not found"  
**Solution:** Install Python and check "Add to PATH" during installation

### Issue: "npm install failed"
**Solution:** 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port already in use"
**Solution:** Close other apps using ports 3000, 8000, or 8545

### Issue: "Virtual environment activation failed"
**Solution:**
```bash
cd backend
python -m venv venv --clear
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🧪 Testing the Blockchain Integration

### 1. Buy Insurance
1. Go to http://localhost:3000
2. Search for flights
3. Select a flight and click "Book Now"
4. Choose insurance plan (Basic/Standard/Premium)
5. Complete payment with test card: `4532015112830366`

### 2. Trigger Payout
```bash
cd backend
python oracle_simulator.py --flight-id [YOUR_FLIGHT_ID] --delay 240
```

You'll see:
```
✅ Policy settled successfully!
💰 1/1 policies paid out
```

### 3. Check Dashboard
- Go to http://localhost:3000/dashboard
- See your policy marked as "CLAIMED"
- View payout transaction in "Payouts Received"

---

## 📁 Project Structure

```
flightguard-dapp/
├── frontend/              # Next.js React app
├── backend/              # Django + FastAPI
├── smart contracts and etls/  # Hardhat + Solidity
├── security/             # Security logs
├── setup.bat            # Automated setup
├── start_blockchain_full.bat  # Start everything
└── SETUP.md             # This file
```

---

## 🔐 Security Logs

All security logs are in `security/logs/`:
- `access.log` - Apache2 format HTTP logs
- `error.log` - Application errors
- `security.log` - Security events
- `blockchain.log` - Blockchain transactions

See `security/README.md` for analysis commands.

---

## 🆘 Need Help?

1. Check `REALISTIC_TESTING.md` for detailed testing guide
2. Check `BLOCKCHAIN_GUIDE.md` for blockchain setup
3. Review logs in `security/logs/` for errors
4. Check backend logs in terminal for Django/FastAPI errors

---

## 🎓 Next Steps After Setup

1. **Explore the App**: Browse flights, book tickets, buy insurance
2. **Test Oracle**: Simulate flight delays and trigger payouts
3. **Review Code**: Check smart contracts in `smart contracts and etls/contracts/`
4. **Security Review**: Analyze logs in `security/logs/`
5. **Customize**: Modify insurance plans, add features

---

## ⚠️ Important Notes

- **Local Development Only**: This setup is for local testing
- **Test Network**: Uses Hardhat local blockchain (resets on restart)
- **Sample Data**: Includes demo flights and test cards
- **No MetaMask Needed**: Backend handles blockchain interactions
- **Automatic Setup**: Everything configured by scripts

---

## 📊 System Requirements

- **OS**: Windows 10/11 (scripts are .bat files)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 2GB free space for dependencies
- **Internet**: Required for initial dependency download

---

✅ **You're all set!** Run `setup.bat` and then `start_blockchain_full.bat` to begin!
