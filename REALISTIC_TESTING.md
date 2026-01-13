# 🧪 Realistic Testing Guide - Insurance Payouts

## Overview

This guide shows you how to test the **complete insurance flow** from purchase to automatic payout!

---

## 🎬 Complete Test Scenario

### Step 1: Seed Realistic Flights

```bash
cd backend
python seed_realistic_flights.py
```

**Result:** 20 flights created with realistic:
- Routes (NYC→London, Dubai→Singapore, etc.)
- Times (past, present, future)
- Statuses (Scheduled, Delayed, On-Time, etc.)

---

### Step 2: Buy Insurance

1. **Go to site**: http://localhost:3000
2. **Search flights**: Find a scheduled flight
3. **Select flight**: Click to view details
4. **Choose insurance**: Select a plan (Basic/Standard/Premium)
5. **Use fake card**: `4532015112830366` (or any from `payment.js`)
6. **Complete booking**

**Result:**
- Policy saved to database
- Policy created on blockchain
- You get `blockchain_tx_hash` in response

---

### Step 3: Simulate Flight Delay (Oracle)

**Run oracle simulator:**

```bash
cd backend
venv\Scripts\activate

# Delay a specific flight (replace 1 with your flight ID)
python oracle_simulator.py --flight-id 1 --delay 240
```

**What Happens:**
```
✈️  Flight 1: New York JFK → London Heathrow
📍 Flight status updated to: Delayed (240 minutes)
🔍 Found 1 active insurance policies

Policy #1
  User: John Doe
  Coverage: $100
  Premium: $15
  ✅ Delay (240m) >= Threshold (180m)
  💰 Triggering payout of $100...
  ✅ PAYOUT SUCCESSFUL!

🎉 Settlement complete!
   1/1 policies paid out
```

---

### Step 4: Verify Payout

**Check Blockchain Terminal:**
```
eth_sendTransaction
  Contract call: UserDelayInsurance.settlePolicy(1, 240)
  From: Oracle (0x7099...)
  Gas used: 120000
  Block: #5
```

**Check Backend Logs:**
```
✅ Policy settled successfully!
   Transaction: 0xabcd1234...
   Gas used: 120000
✅ Database updated: Policy 1 marked as Claimed
```

**Check Django Admin:**
1. http://localhost:8000/admin
2. Go to **Insurance Policies**
3. Find your policy
4. Status should be: **Claimed** ✅

---

## 🎯 Example Full Workflow

```bash
# Terminal 1: Blockchain (already running)
# Terminal 2: Backend (already running)
# Terminal 3: Frontend (already running)

# Terminal 4: Testing
cd backend
venv\Scripts\activate

# 1. Create realistic flights
python seed_realistic_flights.py

# 2. Browse site, buy insurance
# (use browser: localhost:3000)

# 3. Trigger delay and payout
python oracle_simulator.py --flight-id 1 --delay 300

# 4. Check results in admin panel
# http://localhost:8000/admin
```

---

## 🤖 Auto-Monitor Mode

For continuous simulation:

```bash
python oracle_simulator.py --auto
```

This automatically:
- Checks all flights
- Finds flights with "Delayed" status
- Settles all active policies
- Triggers payouts

---

## 💳 About Fake Cards

**They're perfect for testing!** Your current setup:
- Validates card using Luhn algorithm ✅
- Checks against whitelist ✅
- Shows realistic payment flow ✅

No need for real payment processors (Stripe, PayPal) for a demo/prototype.

---

## 🎯 What to Test

### Scenario 1: Successful Claim
1. Buy Basic insurance (3-hour threshold)
2. Delay flight by 240 minutes (4 hours)
3. **Expected**: Payout triggered ✅

### Scenario 2: No Claim
1. Buy Basic insurance (3-hour threshold)
2. Delay flight by 120 minutes (2 hours)
3. **Expected**: No payout (under threshold) ✅

### Scenario 3: Multiple Policies
1. Multiple users buy insurance for same flight
2. Delay the flight
3. **Expected**: All users get paid automatically ✅

---

## ✨ The Magic

**Before blockchain:**
- User files claim
- Admin reviews manually
- Days later: payout (maybe)

**With blockchain:**
- Oracle detects delay
- Smart contract checks threshold
- **INSTANT AUTOMATIC PAYOUT** 🎉
- Zero human intervention needed

---

## 🐛 Troubleshooting

**"Oracle address not found"**
- Check `deployed_addresses.json` has `oracle` field
- Re-deploy contracts if needed

**"Policy not found on blockchain"**
- Make sure you bought insurance AFTER deploying contracts
- Check backend logs for blockchain transaction hash

**"No policies found"**
- Buy insurance first via the website
- Check Django admin to verify policy exists

---

## Next Steps

1. ✅ Seed flights
2. ✅ Buy insurance (with fake card - totally fine!)
3. ✅ Run oracle simulator
4. ✅ Watch automatic payouts happen!

**Your insurance DApp is now fully functional!** 🚀
