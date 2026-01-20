# How to Restart the Server

## Step 1: Stop Current Server
Press `Ctrl + C` in the terminal where nodemon is running

## Step 2: Restart with New Configuration
```bash
cd C:\SSSSSS\saf_web_portal
nodemon nodeapp.js
```

## What Changed:
✅ Created `nodemon.json` - Prevents constant restarts
✅ Improved captcha error handling - Better logging
✅ Added try-catch blocks - Handles exceptions gracefully

## Expected Output:
```
SAF Web Portal Started. listening at http://:::4901
Database connected successfully
INFO: In generateCaptchaCntrl
INFO: Captcha generated: ID 1
```

## Test Captcha API:
```bash
curl https://settibalijaactionforce.com/auth2/admin/login/captcha
```

Should return:
```json
{
  "status": 200,
  "data": {
    "data": "data:image/svg+xml;base64,...",
    "cptch_id": 1,
    "salt_ky": "abc123..."
  }
}
```

## If Still Having Issues:

### Check Database Connection:
1. Verify MySQL is running
2. Check .env file has correct DB credentials
3. Test connection: `mysql -u username -p`

### Check Captcha Table:
```sql
USE saf_db;
SHOW TABLES LIKE 'usr_cptch_lst_t';
SELECT * FROM usr_cptch_lst_t ORDER BY i_ts DESC LIMIT 5;
```

### Enable Debug Logs:
The captcha controller now logs:
- When function is called
- Captcha ID when generated  
- Errors with details

Watch the terminal for these messages.











