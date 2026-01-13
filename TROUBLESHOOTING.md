# Troubleshooting: Booking 500 Error on Cloned Installation

## Issue
Booking works on original folder but fails with 500 error on cloned installation despite:
- ✅ Database has flights (70 count)
- ✅ `deployed_addresses.json` exists
- ✅ `.env` file exists with `BLOCKCHAIN_ENABLED=True`
- ✅ Backend shows "BLOCKCHAIN_ENABLED env=True, result=True"

## Error Symptoms
- Frontend: `POST http://localhost:8000/api/bookings/ 500 (Internal Server Error)`
- Backend: Shows only `127.0.0.1 - POST /api/bookings/ - Status 500` without traceback
- error.log: `[ERROR] 127.0.0.1 - POST /api/bookings/ - Status 500`

## Probable Causes
1. **Blockchain not running** - No Hardhat node listening on port 8545
2. **Wrong contract addresses** - Copied addresses from different blockchain instance
3. **User doesn't exist** - User ID 1 not in database

## Quick Diagnostic Steps

### 1. Check if Hardhat Blockchain is Running
```bash
curl http://127.0.0.1:8545 -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```
**Expected:** JSON response with block number
**If fails:** Blockchain not running

### 2. Check User Exists
```bash
cd backend
venv\Scripts\activate
python manage.py shell
```
Then:
```python
from django.contrib.auth.models import User
print(User.objects.filter(id=1).exists())
# Should print: True
```

### 3. Verify Contract Addresses Match Running Blockchain
```bash
cd "smart contracts and etls"
npx hardhat console --network localhost
```
Then:
```javascript
const addr = await ethers.getSigners();
addr[0].address
// Compare with deployer address in deployed_addresses.json
```

## Solution

**Most Likely Fix:** The cloned installation needs a fresh blockchain setup.

```bash
# 1. Stop all services (close all terminals)

# 2. Delete old blockchain data (if any)
rmdir /s "smart contracts and etls\cache"
rmdir /s "smart contracts and etls\artifacts"

# 3. Start fresh
.\start_blockchain_full.bat

# 4. Wait for "ALL SERVICES STARTED"

# 5. Try booking again
```

## If Problem Persists

Add detailed error logging to see actual exception:

1. Modify `backend/api/endpoints/bookings.py`
2. Wrap `create_booking` function in try-except
3. Print full traceback
4. Restart backend
5. Try booking and send full error

## Common Error Messages

- `Connection refused`: Blockchain not running
- `User matching query does not exist`: Run `python seed_database.py`
- `Flight matching query does not exist`: Database empty - run seed
- `StatusLookup matching query does not exist`: Database not seeded  
- `Contract not found at address`: Wrong contract addresses
- `Insufficient funds`: User account has no tokens
