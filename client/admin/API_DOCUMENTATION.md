# SAF Admin Portal - API Documentation

## Server Configuration

**Base URL:** `http://localhost:4901`  
**API Prefix:** `/auth2/admin`  
**Server File:** `C:\SSSSSS\saf_web_portal\nodeapp.js`

---

## Authentication Endpoints

### 1. Get Captcha
**Endpoint:** `GET /auth2/admin/login/captcha`

**Description:** Generate a new captcha image with salt key for login

**Response:**
```json
{
  "status": 200,
  "data": {
    "data": "data:image/svg+xml;base64,<base64_encoded_svg>",
    "cptch_id": 123,
    "salt_ky": "abc123def456"
  },
  "message": "Success"
}
```

---

### 2. User Login
**Endpoint:** `POST /auth2/admin/login`

**Description:** Authenticate user with username, password, and captcha

**Request Body:**
```json
{
  "username": "admin",
  "password": "<MD5(MD5(sha512(password)) + salt_ky)>",
  "captcha": "1234",
  "captchaID": 123,
  "app": "web"
}
```

**Password Encryption:**
1. Hash password with SHA512: `sha512(plain_password)`
2. Concatenate with salt key: `sha512_hash + salt_ky`
3. MD5 hash the result: `MD5(sha512_hash + salt_ky)`
4. MD5 hash again: `MD5(MD5(sha512_hash + salt_ky))`

**Success Response:**
```json
{
  "status": 200,
  "data": {
    "user": {
      "usr_id": 1,
      "fst_nm": "Admin",
      "lst_nm": "User",
      "usr_nm": "admin",
      "eml_tx": "admin@saf.org",
      "clnt_id": 1,
      "tnt_id": 1,
      "roles": {
        "rle_id": 1,
        "rle_nm": "Super Admin",
        "admn_rle_in": 1
      },
      "dsgns": {
        "dsgns_id": 1,
        "dsgns_nm": "Administrator"
      }
    },
    "clnts": [...],
    "assignedProfiles": {
      "mnu_prfle": 1,
      "stp_prfle": "",
      "rpt_prfle": 2,
      "hlp_prfle": 3,
      "mnu_home_pg": "internal/dashboard"
    },
    "qrcode": 123456
  },
  "message": "Login successful"
}
```

**Error Response:**
```json
{
  "status": 411,
  "data": null,
  "message": "Invalid username or password",
  "errors": []
}
```

---

### 3. Logout
**Endpoint:** `GET /auth2/admin/logout`

**Description:** Logout user and expire session

**Headers:** 
- `x-access-token`: JWT token

**Response:**
```json
{
  "status": 200,
  "data": {},
  "message": "Logged out successfully"
}
```

---

### 4. Forgot Password - Send OTP
**Endpoint:** `POST /auth2/admin/forgot-password/send-otp`

**Description:** Send OTP to user's email for password reset

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@saf.org",
  "captcha": "1234",
  "captchaID": 123
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "success_msg": "OTP sent",
    "otpID": 456
  },
  "message": "Success"
}
```

---

### 5. Forgot Password - Resend OTP
**Endpoint:** `POST /auth2/admin/forgot-password/resend-otp`

**Description:** Resend OTP to user's email

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@saf.org",
  "captcha": "1234",
  "captchaID": 123
}
```

---

### 6. Forgot Password - Validate OTP
**Endpoint:** `POST /auth2/admin/forgot-password/validate-otp`

**Description:** Validate OTP and reset password

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@saf.org",
  "otp": "1234",
  "otpID": 456
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "success_msg": "Password reset successful. Check your email for new password."
  },
  "message": "Success"
}
```

---

### 7. Get User Roles
**Endpoint:** `GET /auth2/admin/roles`

**Description:** Get list of user roles

**Headers:**
- `x-access-token`: JWT token

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "rle_id": 1,
      "rle_nm": "Super Admin",
      "rle_dscrn_tx": "Full system access",
      "admn_rle_in": 1,
      "ttl_usr_cnt": 5
    }
  ],
  "message": "Success"
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed successfully |
| 411 | Invalid Credentials | Username or password incorrect |
| 601 | Invalid Captcha | Captcha does not match |
| 429 | Too Many Attempts | Maximum OTP attempts exceeded |
| 401 | Unauthorized | Invalid or missing token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Authentication Flow

1. **Get Captcha**
   - Client calls `GET /auth2/admin/login/captcha`
   - Server generates SVG captcha and salt key
   - Store captcha in database
   - Return base64 encoded image, captcha ID, and salt key

2. **User Login**
   - User enters credentials and captcha
   - Client encrypts password with salt key
   - Client sends POST request to `/auth2/admin/login`
   - Server validates captcha
   - Server validates credentials
   - Server generates JWT token
   - Server creates session
   - Server records login history
   - Return user data, profiles, and token

3. **Authenticated Requests**
   - Client includes `x-access-token` header
   - Server verifies JWT token
   - Server authorizes request
   - Process request and return response

4. **Logout**
   - Client calls `GET /auth2/admin/logout`
   - Server expires session
   - Clear client storage

---

## Security Features

### Password Encryption
- Client-side: SHA512 hashing
- Server-side: MD5 with dynamic salt key
- Double MD5 hashing for additional security

### Captcha Validation
- SVG-based captcha generation
- One-time use (deactivated after validation)
- Automatic cleanup of old captcha records

### Session Management
- JWT tokens with expiration
- MySQL session store
- Automatic session expiration
- Single session per user per app type

### OTP Security
- Time-based OTP (30 minutes validity)
- Maximum 3 attempts
- Automatic email delivery
- Temporary password generation

---

## Frontend Integration

### Required Dependencies
```json
{
  "axios": "^1.6.0",
  "js-sha512": "^0.9.0"
}
```

### Example Implementation
```javascript
import axios from 'axios';
import sha512 from 'js-sha512';

const API_BASE_URL = 'http://localhost:4901';

// Get Captcha
const getCaptcha = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth2/admin/login/captcha`);
  return response.data.data;
};

// Login
const login = async (username, password, captcha, captchaID, saltKey) => {
  // Encrypt password
  const sha512Hash = sha512.sha512(password);
  const md5Hash1 = md5(`${sha512Hash}${saltKey}`);
  const finalHash = md5(md5Hash1);
  
  const response = await axios.post(`${API_BASE_URL}/auth2/admin/login`, {
    username,
    password: finalHash,
    captcha,
    captchaID,
    app: 'web'
  });
  
  return response.data;
};
```

---

## Database Tables Used

See `DATABASE_SCHEMA.md` for complete table structures:

- **usr_lst_t** - User list
- **usr_clnt_tnt_rel_t** - User-client-tenant relationships
- **usr_rle_lst_t** - User roles
- **usr_dsgns_lst_t** - User designations
- **clnt_dtl_t** - Client details
- **clnt_tnt_lst_t** - Tenant list
- **usr_cptch_lst_t** - Captcha storage
- **usr_otp_lst_t** - OTP records
- **usr_lgn_hstry_dtl_t** - Login history
- **user_session_dtl_t** - Session storage
- **app_prfle_lst_t** - Application profiles
- **app_prfle_rle_rel_t** - Profile-role relationships
- **app_prfle_ctgry_lst_t** - Profile categories

---

## Notes

- All timestamps are in UTC
- Sessions expire based on server configuration
- JWT tokens contain user ID, role, client, tenant info
- CORS must be configured for frontend domain
- Use HTTPS in production




