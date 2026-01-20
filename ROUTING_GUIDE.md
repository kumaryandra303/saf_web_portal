# Routing Guide - New Structure

## 🔄 How Routing Works in the New Structure

### Request Flow Diagram

```
Client Request
     ↓
http://localhost:3000/apiv1/auth2/admin/login
     ↓
[nodeapp.js] - Main Server
     ↓
app.use('/apiv1', require('./server/api/routes/apiRoutes'))
     ↓
[server/api/routes/apiRoutes.js] - Main API Router
     ↓
router.use('/auth2/admin', require('./server/api/routes/auth2/adminAuthRtr'))
     ↓
[server/api/routes/auth2/adminAuthRtr.js] - Auth Router
     ↓
adminAuthRtr.post('/login', authCtrl.userLoginCtrl)
     ↓
[server/api/modules/auth2/controllers/adminAuth2Ctrl.js] - Controller
     ↓
exports.userLoginCtrl = function (req, res) { ... }
     ↓
authMdl.loginMdl(reqBody, cpthc_res)
     ↓
[server/api/modules/auth2/models/adminAuth2Mdl.js] - Model
     ↓
exports.loginMdl = function (data, sltKey) { 
    // Execute SQL query
    return dbutil.execQuery(...)
}
     ↓
Database Query Execution
     ↓
Response to Client
```

## 📂 File Structure Comparison

### ❌ OLD STRUCTURE (Deleted)
```
├── server.js (ES6)
│   ├── import express from 'express'
│   ├── import userRoutes from './routes/user.routes.js'
│   └── app.use('/api/users', userRoutes)
│
└── routes/
    └── user.routes.js
        └── Router with user CRUD operations
```

### ✅ NEW STRUCTURE (Active)
```
├── nodeapp.js (CommonJS) - MAIN ENTRY POINT
│   ├── var express = require('express')
│   └── app.use('/apiv1', require('./server/api/routes/apiRoutes'))
│
└── server/
    └── api/
        ├── routes/
        │   ├── apiRoutes.js - MAIN API ROUTER
        │   │   └── router.use('/auth2/admin', require(...))
        │   │
        │   └── auth2/
        │       └── adminAuthRtr.js - AUTH ROUTES
        │           ├── POST /login
        │           ├── GET /login/captcha
        │           ├── GET /logout
        │           └── ...
        │
        └── modules/
            ├── auth2/ - AUTHENTICATION MODULE
            │   ├── controllers/
            │   │   └── adminAuth2Ctrl.js - BUSINESS LOGIC
            │   │       ├── exports.userLoginCtrl
            │   │       ├── exports.generateCaptchaCntrl
            │   │       └── ...
            │   │
            │   └── models/
            │       └── adminAuth2Mdl.js - DATABASE QUERIES
            │           ├── exports.loginMdl
            │           ├── exports.getUsrClntsMdl
            │           └── ...
            │
            └── captcha/ - CAPTCHA MODULE
                ├── controller/
                │   └── captchaCtrl.js
                └── model/
                    └── captchaMdl.js
```

## 🎯 URL Mapping

### Complete URL Breakdown

| Full URL | Breakdown |
|----------|-----------|
| `http://localhost:3000/apiv1/auth2/admin/login` | |
| ├─ `http://localhost:3000` | Server base URL |
| ├─ `/apiv1` | API version prefix (in nodeapp.js) |
| ├─ `/auth2/admin` | Auth2 admin routes (in apiRoutes.js) |
| └─ `/login` | Specific endpoint (in adminAuthRtr.js) |

### Route Registration Chain

```javascript
// 1. nodeapp.js
app.use('/apiv1', require('./server/api/routes/apiRoutes'));
// Registers all /apiv1/* routes

// 2. server/api/routes/apiRoutes.js
router.use('/auth2/admin', require('./server/api/routes/auth2/adminAuthRtr'));
// Adds /auth2/admin/* to the /apiv1 prefix
// Result: /apiv1/auth2/admin/*

// 3. server/api/routes/auth2/adminAuthRtr.js
adminAuthRtr.post('/login', authCtrl.userLoginCtrl);
// Adds /login to the /apiv1/auth2/admin prefix
// Final URL: /apiv1/auth2/admin/login
```

## 📋 All Available Endpoints

### Authentication Endpoints

| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| `GET` | `/apiv1/auth2/admin/login/captcha` | `generateCaptchaCntrl` | Generate captcha image |
| `POST` | `/apiv1/auth2/admin/login` | `userLoginCtrl` | User login with credentials |
| `GET` | `/apiv1/auth2/admin/logout` | `logoutC` | Logout current session |
| `POST` | `/apiv1/auth2/admin/forgot-password/send-otp` | `emply_snd_otpC` | Send OTP to email |
| `POST` | `/apiv1/auth2/admin/forgot-password/resend-otp` | `emply_resnd_otpC` | Resend OTP |
| `POST` | `/apiv1/auth2/admin/forgot-password/validate-otp` | `emply_vldt_otpC` | Validate OTP & reset password |
| `GET` | `/apiv1/auth2/admin/saltkey` | `getSaltKeyCtrl` | Get salt key for encryption |
| `GET` | `/apiv1/auth2/admin/roles` | `getUsrRolesLstCtrl` | Get user roles list |

## 🔗 How to Add New Routes

### Example: Adding a User Management Module

#### Step 1: Create Module Structure
```bash
server/api/modules/users/
├── controllers/
│   └── usersCtrl.js
└── models/
    └── usersMdl.js
```

#### Step 2: Create Controller
```javascript
// server/api/modules/users/controllers/usersCtrl.js
var df = require(appRoot + '/utils/dflower.utils');
var usersMdl = require('../models/usersMdl');

exports.getAllUsersCtrl = function (req, res) {
    var fnm = "getAllUsersCtrl";
    usersMdl.getAllUsersMdl()
        .then(function (result) {
            return df.formatSucessRes(req, res, result, cntxtDtls, fnm, {});
        })
        .catch(function (error) {
            df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
}
```

#### Step 3: Create Model
```javascript
// server/api/modules/users/models/usersMdl.js
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var dbutil = require(appRoot + '/utils/db.utils');

exports.getAllUsersMdl = function () {
    var QRY_TO_EXEC = `SELECT * FROM usr_lst_t WHERE a_in=1`;
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
```

#### Step 4: Create Router
```javascript
// server/api/routes/users/usersRtr.js
var usersRtr = require('express').Router();
var usersCtrl = require('../../modules/users/controllers/usersCtrl');

usersRtr.get('/all', usersCtrl.getAllUsersCtrl);

module.exports = usersRtr;
```

#### Step 5: Register in Main API Router
```javascript
// server/api/routes/apiRoutes.js
var express = require('express');
var router = express.Router();

// Existing routes
router.use('/auth2/admin', require('./auth2/adminAuthRtr'));

// NEW: Add users routes
router.use('/users', require('./users/usersRtr'));

module.exports = router;
```

#### Result
New endpoint available at: `GET /apiv1/users/all`

## 🧪 Testing Endpoints

### Using curl

```bash
# 1. Get Captcha
curl http://localhost:3000/apiv1/auth2/admin/login/captcha

# 2. Login
curl -X POST http://localhost:3000/apiv1/auth2/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "HASHED_PASSWORD",
    "captcha": "1234",
    "captchaID": 1,
    "app": "web"
  }'

# 3. Get Roles
curl http://localhost:3000/apiv1/auth2/admin/roles
```

### Using JavaScript (Frontend)

```javascript
// Get Captcha
fetch('http://localhost:3000/apiv1/auth2/admin/login/captcha')
  .then(res => res.json())
  .then(data => console.log(data));

// Login
fetch('http://localhost:3000/apiv1/auth2/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'HASHED_PASSWORD',
    captcha: '1234',
    captchaID: 1,
    app: 'web'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 🎨 Module Pattern

Every module follows this pattern:

```
module_name/
├── controllers/
│   └── moduleCtrl.js        # Business logic, validation
│       ├── Request handling
│       ├── Input validation
│       ├── Calls to model
│       └── Response formatting
│
└── models/
    └── moduleMdl.js          # Database queries
        ├── SQL query construction
        ├── Database operations
        └── Return results
```

## 🔐 Middleware Integration

### Adding Authentication Middleware

```javascript
// Create middleware (server/api/validators/authValidator.js)
exports.hasToken = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Verify token
    jwt.verify(token, appSettings.app.session_sec_key, function(err, decoded) {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// Use in router
var authValidator = require('../../validators/authValidator');
adminAuthRtr.get('/roles', authValidator.hasToken, authCtrl.getUsrRolesLstCtrl);
```

## 📝 Key Concepts

### 1. CommonJS Modules
```javascript
// Import
var express = require('express');
var router = require('express').Router();

// Export
module.exports = router;
module.exports = { function1, function2 };
exports.myFunction = function() { ... };
```

### 2. Global appRoot Variable
```javascript
// Set in nodeapp.js
appRoot = __dirname;

// Used everywhere
var utils = require(appRoot + '/utils/standardMessages');
```

### 3. Route Prefixing
Each level adds to the URL:
- nodeapp.js: `/apiv1`
- apiRoutes.js: `/auth2/admin`
- adminAuthRtr.js: `/login`
- **Result:** `/apiv1/auth2/admin/login`

## 🚀 Summary

**Old Way:**
```javascript
// server.js
import userRoutes from './routes/user.routes.js';
app.use('/api/users', userRoutes);
```

**New Way:**
```javascript
// nodeapp.js
app.use('/apiv1', require('./server/api/routes/apiRoutes'));

// server/api/routes/apiRoutes.js
router.use('/auth2/admin', require('./auth2/adminAuthRtr'));

// server/api/routes/auth2/adminAuthRtr.js
adminAuthRtr.post('/login', authCtrl.userLoginCtrl);

// server/api/modules/auth2/controllers/adminAuth2Ctrl.js
exports.userLoginCtrl = function(req, res) { ... }
```

This modular approach provides:
- ✅ Clear separation of concerns
- ✅ Easy to add new modules
- ✅ Scalable architecture
- ✅ Maintainable codebase
- ✅ Follows industry standards

Happy coding! 🎉















