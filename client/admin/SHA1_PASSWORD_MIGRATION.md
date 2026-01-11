# SAF Admin Portal - SHA1 Password Migration Guide

## ✅ Password Encryption Updated to SHA1

The password encryption has been simplified from **SHA512+MD5** to **SHA1 only**.

---

## 🔄 What Changed

### Frontend (Admin Portal)

**Before:**
```javascript
// Complex encryption: SHA512 → MD5 → MD5
const sha512Hash = sha512(password);
const combined = sha512Hash + saltKey;
const md5Hash1 = MD5(combined);
const finalHash = MD5(md5Hash1);
```

**After:**
```javascript
// Simple SHA1 hash
const sha1Hash = SHA1(password);
```

### Backend (Database Query)

**Before:**
```sql
WHERE MD5(CONCAT(MD5(pwd_tx), saltKey)) = encrypted_password
```

**After:**
```sql
WHERE SHA1(pwd_tx) = encrypted_password
```

---

## 📝 How It Works Now

### 1. User Enters Password
```
User enters: "Admin@123"
```

### 2. Frontend Encrypts with SHA1
```javascript
import CryptoJS from 'crypto-js';

const password = "Admin@123";
const encrypted = CryptoJS.SHA1(password).toString();
// Result: "6367c48dd193d56ea7b0baad25b19455e529f5ee"
```

### 3. Backend Compares
```sql
SELECT * FROM usr_lst_t 
WHERE usr_nm = 'admin'
AND SHA1(pwd_tx) = '6367c48dd193d56ea7b0baad25b19455e529f5ee'
```

---

## 🗄️ Database Password Storage

Passwords are now stored as **PLAIN TEXT** in the database, and SHA1 comparison happens in the SQL query.

### Example:
```sql
-- User table
usr_id | usr_nm  | pwd_tx        | ...
--------|---------|---------------|----
1       | admin   | Admin@123     | ...
2       | user1   | MyPass456     | ...
```

During login, the query does:
```sql
SHA1('Admin@123') = SHA1(pwd_tx)
```

---

## 🔧 Setup Instructions

### Step 1: Update Existing Passwords

Run the SQL script to update passwords:

```bash
mysql -u root -p saf_db < UPDATE_PASSWORDS_TO_SHA1.sql
```

Or manually update:

```sql
USE saf_db;

-- Update admin password to 'Admin@123'
UPDATE usr_lst_t 
SET pwd_tx = 'Admin@123'
WHERE usr_nm = 'admin';

-- Update other users
UPDATE usr_lst_t 
SET pwd_tx = 'NewPassword123'
WHERE usr_nm = 'otheruser';
```

### Step 2: Restart Backend Server

```bash
cd C:\SSSSSS\saf_web_portal
# Stop current server (Ctrl+C)
nodemon nodeapp.js
```

### Step 3: Restart Admin Portal

```bash
cd C:\SSSSSS\saf_web_portal\client\admin
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Test Login

1. Navigate to: http://localhost:3001/login
2. Enter username: `admin`
3. Enter password: `Admin@123` (or whatever you set in database)
4. Enter captcha
5. Click Login

---

## 🧪 Testing SHA1 Encryption

### In Browser Console:

```javascript
// Test SHA1 encryption
import CryptoJS from 'crypto-js';

const password = "Admin@123";
const sha1 = CryptoJS.SHA1(password).toString();
console.log(sha1);
// Output: "6367c48dd193d56ea7b0baad25b19455e529f5ee"
```

### In MySQL:

```sql
-- Test SHA1 in database
SELECT 
    usr_nm,
    pwd_tx,
    SHA1(pwd_tx) as sha1_hash
FROM usr_lst_t 
WHERE usr_nm = 'admin';

-- Test login query
SELECT * FROM usr_lst_t
WHERE usr_nm = 'admin'
AND SHA1(pwd_tx) = SHA1('Admin@123');
```

---

## 📊 Files Modified

### Frontend:
1. ✅ `src/utils/crypto.js` - Changed to SHA1 only
2. ✅ `src/context/AuthContext.jsx` - Removed saltKey parameter
3. ✅ `src/pages/auth/Login.jsx` - Removed saltKey from login call

### Backend:
4. ✅ `server/api/modules/auth2/models/adminAuth2Mdl.js` - Changed query to SHA1
5. ✅ `server/api/modules/auth2/controllers/adminAuth2Ctrl.js` - Removed saltKey from loginMdl call

---

## ⚠️ Important Security Notes

### Current Implementation:
- ✅ Frontend sends SHA1 hashed password
- ⚠️ Database stores PLAIN TEXT passwords
- ✅ SHA1 comparison in SQL query

### Security Considerations:

**For Production, Consider:**

1. **Store SHA1 hashed passwords:**
   ```sql
   UPDATE usr_lst_t SET pwd_tx = SHA1('password');
   ```
   Then compare: `pwd_tx = user_sha1_hash`

2. **Use stronger hashing:**
   - Bcrypt with salt
   - Argon2
   - PBKDF2

3. **Add password policies:**
   - Minimum length
   - Complexity requirements
   - Expiration

4. **Implement:**
   - Account lockout after failed attempts
   - Password history
   - Two-factor authentication

---

## 🔍 Troubleshooting

### Issue: Login fails with correct password

**Check 1: Verify password in database**
```sql
SELECT usr_nm, pwd_tx, SHA1(pwd_tx) 
FROM usr_lst_t 
WHERE usr_nm = 'admin';
```

**Check 2: Test SHA1 comparison**
```sql
SELECT 
    usr_nm,
    CASE 
        WHEN SHA1(pwd_tx) = SHA1('YourPassword') 
        THEN 'MATCH' 
        ELSE 'NO MATCH' 
    END as test
FROM usr_lst_t
WHERE usr_nm = 'admin';
```

**Check 3: Check frontend console**
- Look for encryption errors
- Verify API calls
- Check network tab for request/response

**Check 4: Check backend logs**
- Look for SQL query
- Check for errors

---

## 📖 Example Usage

### Creating New User with Password:

```sql
-- Create user with plain password
INSERT INTO usr_lst_t (usr_nm, pwd_tx, fst_nm, lst_nm, eml_tx, a_in)
VALUES ('newuser', 'MyPassword123', 'New', 'User', 'new@saf.org', 1);

-- Link to client/tenant
INSERT INTO usr_clnt_tnt_rel_t (usr_id, clnt_id, tnt_id, rle_id, a_in)
VALUES (LAST_INSERT_ID(), 1, 1, 1, 1);
```

### Changing Password:

```sql
UPDATE usr_lst_t 
SET pwd_tx = 'NewPassword456',
    u_ts = CURRENT_TIMESTAMP()
WHERE usr_nm = 'username';
```

---

## ✅ Verification Checklist

- [ ] SQL script run successfully
- [ ] Admin password updated in database
- [ ] Backend server restarted
- [ ] Admin portal restarted
- [ ] Can see captcha on login page
- [ ] Can login with updated password
- [ ] Redirects to dashboard after login
- [ ] No errors in browser console
- [ ] No errors in server logs

---

## 📞 Need Help?

Check:
- `UPDATE_PASSWORDS_TO_SHA1.sql` - SQL migration script
- Server logs for errors
- Browser console for frontend errors
- Network tab for API responses

---

**Status:** ✅ Password system updated to SHA1  
**Date:** January 8, 2026  
**Compatibility:** All existing users need password reset






