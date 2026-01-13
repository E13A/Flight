# ✅ Quick Verification Checklist

Before testing oracle payouts, verify your setup:

## Step 1: Backend Has Blockchain Code ✓

Your backend terminal should show at startup:
```
✅ Connected to blockchain at http://127.0.0.1:8545
   Chain ID: 31337
```

**Status:** Check your backend terminal now!

---

## Step 2: Buy NEW Insurance

**CRITICAL:** Old policies (1-3) were created before blockchain integration!

### How to Buy Blockchain-Enabled Insurance:

1. **Open:** http://localhost:3000
2. **Search** for flights
3. **Select** any flight (ID 21-40 are freshly seeded)
4. **Choose insurance:** Basic, Standard, or Premium
5. **Complete payment** (use any fake card)

### ✅ Verify Response Has:
```json
{
  "status": "success",
  "booking_id": 4,
  "policy_id": 4,
  "blockchain_tx_hash": "0x1234...abcd",  ← MUST BE PRESENT
  "blockchain_policy_id": 1,               ← MUST BE PRESENT
  "message": "Booking confirmed successfully with blockchain insurance"
}
```

**If missing `blockchain_tx_hash`:** Backend didn't call blockchain! Check logs.

---

## Step 3: Check Blockchain Transaction

**In your blockchain terminal**, you should see:
```
eth_sendTransaction
  Contract call: UserDelayInsurance.buyPolicy(...)
  Block: #X
```

---

## Step 4: Run Oracle

**Only AFTER** completing steps 1-3:

```bash
cd backend
venv\Scripts\activate
python oracle_simulator.py --flight-id [YOUR_FLIGHT_ID] --delay 240
```

Expected output:
```
✅ Policy settled successfully!
   Transaction: 0xabcd...
🎉 Settlement complete!
   1/1 policies paid out
```

---

## 🐛 If Oracle Still Fails

**Error:** `InvalidPolicy()`

**Cause:** Policy not on blockchain

**Solution:**
1. Check Step 2 response had `blockchain_tx_hash`
2. Use correct flight ID from your NEW booking
3. Verify blockchain terminal showed transaction

---

## 💡 Quick Test

**Fastest way to verify everything works:**

```bash
# 1. Open website, book flight #21 with insurance
# 2. Note the flight ID from your booking
# 3. Run oracle:
python oracle_simulator.py --flight-id 21 --delay 240
```

**Success = automatic payout!** 🎉
