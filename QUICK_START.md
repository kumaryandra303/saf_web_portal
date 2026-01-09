# Quick Start Guide - SAF Web Portal

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source schema.sql

# Or from command line
mysql -u root -p < schema.sql
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=saf_db
DB_PORT=3306
SESSION_SECRET=saf-secret-key-2024-change-this
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
CLIENT_URL=http://localhost:3000
```

### 4. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

### 5. Test the API

#### Get Captcha
```bash
curl http://localhost:3000/apiv1/auth2/admin/login/captcha
```

#### Login
```bash
curl -X POST http://localhost:3000/apiv1/auth2/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "MD5_HASH_OF_PASSWORD_WITH_SALT",
    "captcha": "1234",
    "captchaID": 1,
    "app": "web"
  }'
```

**Default Login Credentials:**
- Username: `admin`
- Password: `Admin@123`

### 6. API Endpoints

All API endpoints are prefixed with `/apiv1` or `/apiv2`

**Authentication Endpoints:**
- `GET /apiv1/auth2/admin/login/captcha` - Get captcha
- `POST /apiv1/auth2/admin/login` - User login
- `GET /apiv1/auth2/admin/logout` - Logout
- `POST /apiv1/auth2/admin/forgot-password/send-otp` - Request OTP
- `POST /apiv1/auth2/admin/forgot-password/resend-otp` - Resend OTP
- `POST /apiv1/auth2/admin/forgot-password/validate-otp` - Validate OTP & reset password
- `GET /apiv1/auth2/admin/saltkey` - Get salt key for password encryption
- `GET /apiv1/auth2/admin/roles` - Get user roles

## Project Structure

```
saf_web_portal/
├── nodeapp.js                  # Main server entry point
├── config/
│   └── db.config.js           # Database configuration
├── utils/                      # Utility functions
├── server/
│   └── api/
│       ├── modules/           # Business logic
│       │   ├── auth2/        # Authentication module
│       │   └── captcha/      # Captcha module
│       └── routes/            # API routes
└── client/                     # Frontend code
```

## Common Issues & Solutions

### Issue 1: Database Connection Error
**Solution:** Check your MySQL credentials in `.env` file and ensure MySQL service is running.

### Issue 2: Email Not Sending
**Solution:** 
- Make sure you're using an App Password (not your regular Gmail password)
- Enable "Less secure app access" or use App-specific passwords
- Configure correct SMTP settings

### Issue 3: Port Already in Use
**Solution:** Change the PORT in `.env` file or kill the process using that port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Issue 4: Session Store Error
**Solution:** Ensure the `user_session_dtl_t` table exists in your database.

## Development Tips

1. **Hot Reload:** Use `nodemon` for development (already configured with `npm run dev`)
2. **Logging:** Check the `log/` directory for error logs
3. **Database Queries:** All queries are logged in console during development
4. **Testing:** Use Postman or curl to test API endpoints

## Security Notes

1. **Change Default Password:** After first login, change the default admin password
2. **Session Secret:** Use a strong, random session secret in production
3. **Email Password:** Use App-specific passwords for Gmail
4. **HTTPS:** Enable HTTPS in production (configure in `nodeapp.js`)
5. **CORS:** Update allowed domains in `nodeapp.js` for production

## Next Steps

1. Integrate with your frontend application
2. Add more modules following the same pattern
3. Set up user management
4. Configure production environment
5. Set up SSL certificates

## Support

For detailed documentation, see `README_NEW_STRUCTURE.md`

## Testing Authentication Flow

### 1. Get Captcha
```javascript
fetch('http://localhost:3000/apiv1/auth2/admin/login/captcha')
  .then(res => res.json())
  .then(data => {
    console.log('Captcha:', data);
    // Use data.cptch_id and data.salt_ky for login
  });
```

### 2. Login
```javascript
// First, hash password with MD5(MD5(password) + salt_ky)
fetch('http://localhost:3000/apiv1/auth2/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'HASHED_PASSWORD',
    captcha: 'CAPTCHA_TEXT',
    captchaID: CAPTCHA_ID,
    app: 'web'
  })
})
.then(res => res.json())
.then(data => console.log('Login:', data));
```

## Monitoring

- Check `log/combined.log` for all logs
- Check `log/error.log` for errors only
- Monitor database connections in MySQL

Good luck with your development! 🚀







