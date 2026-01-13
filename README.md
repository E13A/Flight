# FlightGuard DApp 🛡️✈️

**Decentralized Flight Delay Insurance Platform**

A full-stack blockchain-enabled insurance DApp that provides automated, trustless payouts for flight delays using Ethereum smart contracts and real-time oracle data.

---

## ✨ Features

- 🎫 **Flight Booking** - Search and book flights from realistic database
- 🛡️ **Smart Insurance** - Percentage-based coverage (30%, 60%, 100% of ticket price)
- ⛓️ **Blockchain Integration** - On-chain policy creation and automated settlements
- 💰 **Auto Payouts** - Trustless compensation via smart contracts
- 🔐 **Security Logging** - Apache2-format access logs and security monitoring
- 📊 **User Dashboard** - Track policies, transactions, and payouts

---

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone <your-repo-url>
cd flightguard-dapp

# 2. Run setup (installs all dependencies)
setup.bat

# 3. Start application
start_blockchain_full.bat

# 4. Open browser
http://localhost:3000
```

**Done!** The app is now running with:
- ✅ Local blockchain
- ✅ Deployed smart contracts  
- ✅ Backend API
- ✅ Frontend UI
- ✅ Demo data loaded

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Lucide Icons** - UI icons

### Backend
- **Django** - ORM and admin panel
- **FastAPI** - REST API
- **GraphQL** - Alternative API
- **Web3.py** - Blockchain interaction

### Blockchain
- **Hardhat** - Development environment
- **Solidity** - Smart contracts
- **Ethereum** - Local testnet

### Database
- **SQLite** - Local development database

---

## 📋 Prerequisites

- Node.js v18+
- Python 3.10+
- Git

See [SETUP.md](SETUP.md) for detailed setup instructions.

---

## 🎯 How It Works

### 1. User Experience
1. Search for flights
2. Book ticket + optional insurance
3. If flight delayed → automatic payout

### 2. Blockchain Flow
```
User Buys Insurance
    ↓
Smart Contract Creates Policy (on-chain)
    ↓
Oracle Detects Flight Delay
    ↓
Smart Contract Executes Payout (automatic)
    ↓
User Receives Compensation
```

### 3. Insurance Plans

| Plan | Premium | Coverage |
|------|---------|----------|
| Basic | $15 | 30% of ticket |
| Standard | $25 | 60% of ticket |
| Premium | $45 | 100% of ticket |

---

## 🧪 Testing

### Buy Insurance
1. Go to http://localhost:3000
2. Book a flight with insurance
3. Use test card: `4532015112830366`

### Trigger Payout
```bash
cd backend
python oracle_simulator.py --flight-id [ID] --delay 240
```

### View Results
- Dashboard shows "CLAIMED" status
- Payout transaction visible
- Blockchain logs updated

---

## 📁 Project Structure

```
├── frontend/                 # Next.js app
│   ├── src/app/             # Pages
│   ├── src/components/      # React components
│   └── src/hooks/           # API hooks
├── backend/                 # Django + FastAPI
│   ├── api/                # REST endpoints
│   ├── core/               # Django models
│   ├── blockchain/         # Web3 integration
│   └── middleware/         # Logging
├── smart contracts and etls/ # Blockchain
│   ├── contracts/          # Solidity contracts
│   └── scripts/            # Deployment
└── security/               # Security logs
    └── logs/               # Access, error, security logs
```

---

## 🔐 Security Features

- Apache2-style access logging
- Security event monitoring
- SQL injection detection
- XSS pattern blocking
- Blockchain transaction logs
- Failed authentication tracking

See [security/README.md](security/README.md) for details.

---

## 📊 Smart Contracts

5 deployed contracts:
1. **UserDelayInsurance** - Policy management
2. **MockToken** - ERC20 test token
3. **TicketProvider** - Flight registration
4. **CompanyFunding** - Insurance pool
5. **Oracle** - (Future: Real flight data)

---

## 🎓 Documentation

- [SETUP.md](SETUP.md) - Complete setup guide
- [REALISTIC_TESTING.md](REALISTIC_TESTING.md) - Testing scenarios
- [BLOCKCHAIN_GUIDE.md](BLOCKCHAIN_GUIDE.md) - Blockchain details
- [security/README.md](security/README.md) - Security logs
- [security/ANALYSIS.md](security/ANALYSIS.md) - Log analysis

---

## 🚦 Development Status

✅ **Completed Features:**
- Frontend UI (search, booking, dashboard)
- Backend API (REST + GraphQL)
- Blockchain integration (Web3.py)
- Smart contracts (deployed & tested)
- Oracle simulator (claim settlement)
- Security logging (Apache2 format)
- Percentage-based insurance
- Automated setup scripts

🔄 **Future Enhancements:**
- Real flight data API
- MetaMask integration
- Testnet deployment
- Mobile responsive improvements
- Advanced analytics dashboard

---

## 📝 License

MIT License - See LICENSE file

---

## 👥 Team

Group 6 - Blockchain & Insurance Innovation

---

## 🆘 Support

**Issues?** Check:
1. [SETUP.md](SETUP.md) - Setup troubleshooting
2. `security/logs/error.log` - Backend errors
3. Browser console - Frontend errors
4. GitHub Issues - Report bugs

---

## 🎉 Acknowledgments

- Hardhat team for development framework
- OpenZeppelin for smart contract libraries
- Next.js team for excellent React framework

---

**Built with ❤️ for decentralized insurance revolution**

⭐ Star this repo if you found it helpful!
