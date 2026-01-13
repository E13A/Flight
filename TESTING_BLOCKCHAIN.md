# 🧪 Testing Blockchain Integration

## Quick Test Guide

### Prerequisites
✅ Blockchain running (`start_blockchain.bat`)  
✅ Contracts deployed (`deploy_contracts.bat`)  
✅ Backend running (restart after code changes!)  
✅ Frontend running  

---

## Test 1: Buy Insurance with Blockchain

### Steps:
1. **Open site**: http://localhost:3000

2. **Search for flights**: Enter origin/destination

3. **Select a flight**: Click on any flight

4. **Choose insurance plan**: Select Basic, Standard, or Premium

5. **Complete booking**: Submit payment

6. **Check response**: Should see success message

### Expected Behavior:

**Frontend Response:**
```json
{
  "status": "success",
  "booking_id": 1,
  "policy_id": 1,
  "blockchain_tx_hash": "0x1234...abcd",
  "blockchain_policy_id": 1,
  "message": "Booking confirmed successfully with blockchain insurance"
}
```

**Blockchain Terminal (Hardhat Node):**
```
eth_sendTransaction
  Contract call: UserDelayInsurance.buyPolicy(...)
  Gas used: 150000
  Block: #3
```

**Backend Logs:**
```
✅ Connected to blockchain at http://127.0.0.1:8545
✅ Loaded UserDelayInsurance contract at 0xDc64...
✅ Blockchain policy created: TX=0x1234..., PolicyID=1
```

---

## Test 2: Verify in Database

### Django Admin Check:

1. Open **http://localhost:8000/admin**

2. Go to **Insurance Policies**

3. Check latest policy - should have:
   - Coverage amount
   - Premium
   - Status: Active
   - Database ID

---

## Test 3: Verify on Blockchain

### Check Transaction Hash:

Open blockchain terminal and look for:
```
eth_sendTransaction
  From: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  To: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
  Value: 0 ETH
  Gas: 150000
  
Transaction: 0x1234...abcd
Block: #3
```

---

## Troubleshooting

### Error: "Blockchain not available"

**Symptom:** Backend logs show:
```
⚠️ Blockchain not available, policy saved to database only
```

**Solution:**
1. Check blockchain is running: `http://127.0.0.1:8545`
2. Check `.env` has `BLOCKCHAIN_ENABLED=True`
3. Restart backend

### Error: "Contract not found"

**Symptom:**
```
❌ UserDelayInsurance address not found
```

**Solution:**
1. Run `deploy_contracts.bat` again
2. Check `deployed_addresses.json` exists
3. Restart backend

### Error: "Transaction failed"

**Symptom:**
```
❌ Blockchain integration failed: <error>
```

**Solution:**
- Policy still saved to database (graceful fallback)
- Check blockchain logs for details
- Ensure deployer account has enough ETH

---

## What to Look For

### Success Indicators:
- ✅ Response includes `blockchain_tx_hash`
- ✅ Response includes `blockchain_policy_id`
- ✅ Message says "with blockchain insurance"
- ✅ Blockchain terminal shows transaction
- ✅ Backend logs show "✅ Blockchain policy created"

### Blockchain is Working!
- Policy exists in **both** database **and** blockchain
- Transaction hash is proof of immutability
- Smart contract can now automatically settle claims

---

## Next: Restart Backend

Backend code changed! **Restart it**:

```bash
# In backend terminal:
Ctrl+C  # Stop server
uvicorn config.asgi:app --host 0.0.0.0 --port 8000 --reload
```

Then test by buying insurance!
