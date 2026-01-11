# SAF Admin Portal - Backend Integration Guide

## ✅ Integration Complete!

Your admin portal is now fully integrated with the Node.js backend at `C:\SSSSSS\saf_web_portal\nodeapp.js`

---

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd C:\SSSSSS\saf_web_portal
npm start
```

The server will start on **http://localhost:4901**

### 2. Start the Admin Portal

```bash
cd C:\SSSSSS\saf_web_portal\client\admin
npm install
npm run dev
```

The admin portal will start on **http://localhost:3001**

### 3. Login

- Navigate to: http://localhost:3001/login
- Use your database credentials (created in `schema.sql`)
- Default user: `admin` / (password set in database)

---

## 📁 Files Created/Modified

### New Files
- ✅ `src/utils/api.js` - Axios HTTP client with interceptors
- ✅ `src/utils/crypto.js` - Password encryption utilities
- ✅ `.env` - Environment configuration
- ✅ `.env.example` - Environment template
- ✅ `API_DOCUMENTATION.md` - Complete API documentation
- ✅ `DATABASE_SCHEMA.md` - Database schema with all tables
- ✅ `BACKEND_INTEGRATION_GUIDE.md` - This file

### Modified Files
- ✅ `package.json` - Added axios, crypto-js, js-sha512
- ✅ `src/context/AuthContext.jsx` - Real API integration
- ✅ `src/pages/auth/Login.jsx` - Backend captcha and login

---

## 🔌 API Endpoints Used

### Authentication
- `GET /auth2/admin/login/captcha` - Get captcha image
- `POST /auth2/admin/login` - User login
- `GET /auth2/admin/logout` - User logout

### Password Reset
- `POST /auth2/admin/forgot-password/send-otp` - Send OTP
- `POST /auth2/admin/forgot-password/resend-otp` - Resend OTP
- `POST /auth2/admin/forgot-password/validate-otp` - Validate OTP

### User Management
- `GET /auth2/admin/roles` - Get user roles

---

## 🔐 Authentication Flow

### Login Process

1. **Get Captcha**
   ```javascript
   GET /auth2/admin/login/captcha
   Response: {
     data: "data:image/svg+xml;base64,...",
     cptch_id: 123,
     salt_ky: "abc123def456"
   }
   ```

2. **Encrypt Password**
   ```javascript
   // Step 1: SHA512 hash
   const sha512Hash = sha512(password);
   
   // Step 2: Combine with salt
   const combined = sha512Hash + saltKey;
   
   // Step 3: MD5 hash (twice)
   const md5Hash1 = MD5(combined);
   const finalHash = MD5(md5Hash1);
   ```

3. **Submit Login**
   ```javascript
   POST /auth2/admin/login
   Body: {
     username: "admin",
     password: "<encrypted_password>",
     captcha: "1234",
     captchaID: 123,
     app: "web"
   }
   ```

4. **Receive Response**
   ```javascript
   Response: {
     user: { usr_id, usr_nm, fst_nm, lst_nm, eml_tx, roles, ... },
     clnts: [...],
     assignedProfiles: {...},
     qrcode: 123456
   }
   Headers: {
     'x-access-token': 'JWT_TOKEN'
   }
   ```

5. **Store Session**
   - User data → `localStorage.saf_admin_user`
   - JWT token → `localStorage.saf_admin_token`

### Protected API Calls

All authenticated requests include JWT token:

```javascript
Headers: {
  'x-access-token': 'JWT_TOKEN'
}
```

---

## 🗄️ Database Setup

### 1. Create Database

```bash
cd C:\SSSSSS\saf_web_portal
mysql -u root -p < schema.sql
```

Or manually:

```sql
CREATE DATABASE IF NOT EXISTS saf_db;
USE saf_db;
-- Run all CREATE TABLE statements from schema.sql
```

### 2. Verify Tables

```sql
USE saf_db;
SHOW TABLES;
-- Should show 13 tables
```

### 3. Check Sample Data

```sql
SELECT * FROM usr_lst_t;
SELECT * FROM clnt_dtl_t;
SELECT * FROM usr_rle_lst_t;
```

---

## ⚙️ Configuration

### Environment Variables

Edit `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4901
VITE_API_PREFIX=/auth2/admin

# App Configuration
VITE_APP_NAME=SAF Admin Portal
VITE_APP_VERSION=1.0.0

# Development
VITE_DEV_PORT=3001
```

### Backend CORS

Ensure backend allows frontend origin. In `nodeapp.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true
}));
```

---

## 🧪 Testing

### Test Captcha Generation

```bash
curl http://localhost:4901/auth2/admin/login/captcha
```

Expected response:
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

### Test Login (Using Postman or curl)

1. Get captcha (note cptch_id and salt_ky)
2. Encrypt password (use crypto.js)
3. POST to login endpoint

---

## 📦 Dependencies

### Frontend (admin/package.json)

```json
{
  "axios": "^1.6.0",          // HTTP client
  "crypto-js": "^4.2.0",       // MD5 encryption
  "js-sha512": "^0.9.0",       // SHA512 hashing
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

### Backend (package.json)

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "jsonwebtoken": "^9.0.2",
  "svg-captcha": "^1.4.0",
  "js-sha512": "^0.9.0",
  "crypto": "^1.0.1"
}
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to server

**Solution:**
1. Check if backend is running on port 4901
2. Verify CORS is configured
3. Check firewall settings

```bash
netstat -ano | findstr :4901
```

### Issue: Captcha not loading

**Solution:**
1. Check backend logs for errors
2. Verify database connection
3. Check `usr_cptch_lst_t` table exists

```sql
SHOW TABLES LIKE 'usr_cptch_lst_t';
```

### Issue: Login fails with "Invalid Credentials"

**Solution:**
1. Verify user exists in database
2. Check password encryption
3. Verify captcha validation

```sql
SELECT * FROM usr_lst_t WHERE usr_nm = 'admin';
SELECT * FROM usr_cptch_lst_t ORDER BY i_ts DESC LIMIT 1;
```

### Issue: JWT token errors

**Solution:**
1. Check `appSettings.app.session_sec_key` in backend
2. Verify `user_session_dtl_t` table
3. Clear browser localStorage and retry

```javascript
localStorage.clear();
location.reload();
```

---

## 🔒 Security Checklist

- ✅ Passwords encrypted with SHA512 + MD5
- ✅ Captcha validation on login
- ✅ JWT token authentication
- ✅ Session management with MySQL
- ✅ One-time use captcha
- ✅ Password attempt tracking (OTP)
- ✅ Login history recording
- ✅ CORS configuration
- ✅ Helmet security headers
- ⚠️ Use HTTPS in production
- ⚠️ Set secure cookies in production
- ⚠️ Implement rate limiting

---

## 📊 Database Tables

See `DATABASE_SCHEMA.md` for complete details.

**Core Authentication Tables:**
- `usr_lst_t` - User accounts
- `usr_clnt_tnt_rel_t` - User-client-tenant relations
- `usr_rle_lst_t` - User roles
- `usr_cptch_lst_t` - Captcha storage
- `usr_otp_lst_t` - OTP for password reset
- `usr_lgn_hstry_dtl_t` - Login history
- `user_session_dtl_t` - Active sessions

**Profile & Permission Tables:**
- `app_prfle_lst_t` - Application profiles
- `app_prfle_rle_rel_t` - Profile-role mapping
- `app_prfle_ctgry_lst_t` - Profile categories

---

## 🎯 Next Steps

### 1. Setup Database
```bash
mysql -u root -p < schema.sql
```

### 2. Start Services
```bash
# Terminal 1: Backend
cd C:\SSSSSS\saf_web_portal
npm start

# Terminal 2: Admin Portal
cd C:\SSSSSS\saf_web_portal\client\admin
npm install
npm run dev
```

### 3. Test Login
- Navigate to http://localhost:3001/login
- Enter credentials from database
- Verify successful login

### 4. Customize
- Update dashboard content
- Add more API endpoints
- Implement user management pages
- Add role-based access control

---

## 📞 API Reference

See `API_DOCUMENTATION.md` for:
- Complete endpoint documentation
- Request/response examples
- Error codes
- Authentication flow
- Frontend integration examples

---

## 💡 Tips

1. **Development:**
   - Keep both backend and frontend running
   - Use browser DevTools Network tab to debug API calls
   - Check backend console for errors

2. **Testing:**
   - Test with different user roles
   - Verify captcha regeneration
   - Test password reset flow
   - Check session expiration

3. **Production:**
   - Use environment variables for API URL
   - Enable HTTPS
   - Set secure cookie flags
   - Implement proper logging
   - Add monitoring

---

## 📝 Summary

✅ **Backend Integration:** Complete  
✅ **Authentication:** Real API with JWT  
✅ **Captcha:** SVG captcha from backend  
✅ **Password:** SHA512 + MD5 encryption  
✅ **Session:** MySQL session store  
✅ **Documentation:** Complete API & DB docs  

**Status:** Ready for development and testing!

---

**Need Help?**
- Review `API_DOCUMENTATION.md` for API details
- Check `DATABASE_SCHEMA.md` for database structure
- See `README.md` for general usage
- Check `PROJECT_INFO.md` for technical details







