# Security Analysis Scripts

This directory contains scripts for analyzing security logs

## Quick Commands

### Access Log Analysis
```bash
# Count requests by status code
cat access.log | awk '{print $9}' | sort | uniq -c

# Top 10 most accessed endpoints
cat access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10

# Find all 404 errors
grep " 404 " access.log

# Find all POST requests
grep "POST" access.log

# Count requests per IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

### Security Log Analysis
```bash
# Count security events by type
grep "\[SECURITY\]" security.log | wc -l

# Find SQL injection attempts
grep -i "select\|union\|drop" security.log

# Find XSS attempts
grep -i "script\|alert" security.log

# Find path traversal attempts
grep "\.\." security.log
```

### Error Log Analysis
```bash
# Count errors by hour
grep "\[ERROR\]" error.log | awk -F: '{print $1":"$2}' | uniq -c

# Find database errors
grep -i "database\|connection" error.log

# Find 500 errors
grep "Status 500" error.log
```

### Blockchain Log Analysis
```bash
# Total transactions
grep "\[BLOCKCHAIN\]" blockchain.log | wc -l

# Count by transaction type
grep "Type=" blockchain.log | awk -F'Type=' '{print $2}' | awk '{print $1}' | sort | uniq -c

# Find failed transactions
grep "Status=FAILED" blockchain.log

# Calculate total payout amount
grep "Type=PAYOUT" blockchain.log | awk -F'Amount=\$' '{print $2}' | awk '{print $1}' | awk '{sum+=$1} END {print "Total: $"sum}'
```

## Automated Security Checks

Run these periodically:

```bash
# Check for suspicious activity in last hour
find security/logs -name "*.log" -mmin -60 -exec grep -H "SECURITY\|ERROR" {} \;

# Monitor for high error rates
tail -100 error.log | grep "\[ERROR\]" | wc -l

# Check for blockchain transaction failures
grep "Status=FAILED" blockchain.log
```
