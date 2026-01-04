# SAF Web Portal - New Project Structure

This document explains the new project structure based on the reference SAC_WEB project.

## Project Structure

```
saf_web_portal/
├── nodeapp.js                      # Main server file (entry point)
├── package.json                    # Dependencies and scripts
├── schema.sql                      # Database schema
├── config/                         # Configuration files
│   └── db.config.js               # Database configuration
├── utils/                          # Utility functions
│   ├── standardMessages.js        # Standard response messages
│   ├── logmessages.js            # Logging utility
│   ├── dflower.utils.js          # Response formatting utilities
│   ├── json.utils.js             # JSON manipulation utilities
│   ├── validate.utils.js         # Input validation utilities
│   ├── db.utils.js               # Database query utilities
│   ├── email.utils.js            # Email sending utilities
│   ├── sms.utils.js              # SMS utilities
│   ├── stringvalidator.js        # SQL injection prevention
│   ├── audit.requests.js         # Request auditing
│   ├── banner.js                 # Server startup banner
│   └── settings.utils.js         # Application settings
├── server/                         # Server-side code
│   └── api/                       # API routes and modules
│       ├── modules/               # Business logic modules
│       │   ├── auth2/            # Authentication module
│       │   │   ├── controllers/  # Auth controllers
│       │   │   │   └── adminAuth2Ctrl.js
│       │   │   └── models/       # Auth models
│       │   │       └── adminAuth2Mdl.js
│       │   └── captcha/          # Captcha module
│       │       ├── controller/   # Captcha controller
│       │       │   └── captchaCtrl.js
│       │       └── model/        # Captcha model
│       │           └── captchaMdl.js
│       └── routes/                # API routes
│           ├── apiRoutes.js      # Main API router
│           └── auth2/            # Auth routes
│               └── adminAuthRtr.js
├── client/                         # Client-side code
│   ├── admin/                     # Admin panel
│   └── public/                    # Public website
├── log/                           # Log files directory
└── models/                        # Old models (can be removed)
```

## Key Features Implemented

### 1. Authentication Module (auth2)

**Location:** `server/api/modules/auth2/`

**Controllers:** (`controllers/adminAuth2Ctrl.js`)
- `userLoginCtrl` - User login with captcha validation
- `generateCaptchaCntrl` - Generate captcha for login
- `getSaltKeyCtrl` - Get salt key for password encryption
- `emply_snd_otpC` - Send OTP for forgot password
- `emply_resnd_otpC` - Resend OTP
- `emply_vldt_otpC` - Validate OTP and reset password
- `logoutC` - Logout user
- `getUsrRolesLstCtrl` - Get user roles list

**Models:** (`models/adminAuth2Mdl.js`)
- `loginMdl` - Login verification
- `recordLoginHistoryMdl` - Record login history
- `getUsrClntsMdl` - Get user clients and tenants
- `getUsrAsgndPrflesMdl` - Get assigned profiles
- `check_usrMdl` - Check if user exists
- `getOtpCntMdl` - Get OTP count
- `sendOtpMdl` - Send OTP via email
- `updtSendOtpMdl` - Update and resend OTP
- `validateOtpMdl` - Validate OTP
- `usr_rst_pswrdM` - Reset password
- `expr_prvs_sesnsM` - Expire previous sessions
- `sesn_logoutM` - Logout session
- `getUsrRolesLstMdl` - Get roles list

### 2. Captcha Module

**Location:** `server/api/modules/captcha/`

**Controller:** (`controller/captchaCtrl.js`)
- `generateCaptchaCntrl` - Generate captcha
- `validateCaptchaCntrl` - Validate captcha
- `captchScheduleJob` - Clean old captcha records

**Model:** (`model/captchaMdl.js`)
- `insrtCpatchaTxtMdl` - Insert captcha
- `validateCaptchaMdl` - Validate captcha
- `getSaltKeyMdl` - Get salt key
- `deactivateValidatedCaptchaMdl` - Deactivate captcha

### 3. API Routes

**Main Router:** `server/api/routes/apiRoutes.js`
- Routes all API requests
- Includes auth2 routes

**Auth2 Router:** `server/api/routes/auth2/adminAuthRtr.js`
```javascript
POST   /apiv1/auth2/admin/login                      - User login
GET    /apiv1/auth2/admin/login/captcha              - Generate captcha
POST   /apiv1/auth2/admin/forgot-password/send-otp   - Send OTP
POST   /apiv1/auth2/admin/forgot-password/resend-otp - Resend OTP
POST   /apiv1/auth2/admin/forgot-password/validate-otp - Validate OTP
GET    /apiv1/auth2/admin/logout                     - Logout
GET    /apiv1/auth2/admin/saltkey                    - Get salt key
GET    /apiv1/auth2/admin/roles                      - Get roles list
```

## Database Setup

1. Create database and tables:
```bash
mysql -u root -p < schema.sql
```

2. Default credentials:
- Username: `admin`
- Password: `Admin@123`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create `.env` file with:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=saf_db
SESSION_SECRET=saf-secret-key-2024
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Running with Nodemon

The project is configured to use `nodemon` for development:

```bash
nodemon nodeapp.js
```

Or use the npm script:
```bash
npm run dev
```

## Key Differences from Old Structure

1. **CommonJS instead of ES6 Modules**
   - Uses `require()` instead of `import`
   - Uses `module.exports` instead of `export`

2. **Modular Structure**
   - Separated concerns: controllers, models, routes
   - Utility functions in dedicated folder
   - Clear separation of authentication logic

3. **Database Pattern**
   - Uses raw SQL queries (not ORM)
   - Connection pooling with mysql2
   - Promise-based queries

4. **Session Management**
   - MySQL session store
   - JWT tokens for API authentication
   - Session expiry handling

5. **Security Features**
   - Helmet.js for security headers
   - CORS configuration
   - SQL injection prevention
   - Captcha validation
   - OTP-based password reset

## Authentication Flow

1. **Login:**
   - Client requests captcha: `GET /apiv1/auth2/admin/login/captcha`
   - Client submits login: `POST /apiv1/auth2/admin/login`
   - Server validates captcha and credentials
   - Server creates session and returns JWT token

2. **Forgot Password:**
   - Client requests captcha
   - Client submits username/email with captcha
   - Server sends OTP via email
   - Client submits OTP for validation
   - Server resets password and sends new password via email

3. **Logout:**
   - Client calls: `GET /apiv1/auth2/admin/logout`
   - Server expires session

## Security Considerations

1. **Password Storage:**
   - Passwords are stored as SHA512 hash
   - Additional MD5 hashing with salt key during login

2. **Captcha:**
   - Generated for each login attempt
   - Deactivated after use
   - Auto-cleaned after 1 hour

3. **OTP:**
   - 6-digit random number
   - Max 3 attempts
   - Valid for 30 minutes
   - Sent via email

4. **Session:**
   - Stored in MySQL
   - 24-hour expiry for web
   - 10-day expiry for mobile
   - Previous sessions expired on new login

## Next Steps

1. Update client application to use new API endpoints
2. Test all authentication flows
3. Configure email settings for OTP
4. Set up SSL certificates for production
5. Add more modules as needed (following the same pattern)

## Support

For questions or issues, contact the SAF development team.

