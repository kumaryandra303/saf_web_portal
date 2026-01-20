# 🔑 Setup Razorpay Keys - Step by Step

## ❌ **Current Error:**
```
Razorpay Order Creation Error: TypeError: Cannot read properties of undefined (reading 'status')
```

**Reason:** Razorpay credentials are not configured!

---

## ✅ **Solution: Configure Razorpay Keys**

### Step 1: Create Razorpay Account (Free)
1. Go to: https://razorpay.com/
2. Click "Sign Up" (Free account)
3. Fill details and verify email
4. Complete basic verification

### Step 2: Get Your API Keys
1. Login to dashboard: https://dashboard.razorpay.com/
2. Go to **Settings** → **API Keys**
3. Click "Generate Test Keys" (for testing)
4. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxxxx`
   - **Key Secret**: Click "Generate" to reveal

### Step 3: Create .env File
Create a file named `.env` in your project root directory:

**Location:** `C:\SSSSSS\saf_web_portal\.env`

**Contents:**
```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_here
RAZORPAY_KEY_SECRET=your_actual_secret_here
```

### Step 4: Paste Your Actual Keys
Replace the placeholder values with your real keys from Razorpay dashboard:

```env
RAZORPAY_KEY_ID=rzp_test_AbCdEfGhIjKlMnOp
RAZORPAY_KEY_SECRET=YourActualSecretKeyGoesHere123
```

### Step 5: Restart Your Server
```bash
# Stop the server (Ctrl+C)
# Start again
npm start
```

---

## 🧪 **Test Mode Keys (For Testing)**

**What you need:**
- Key ID starting with: `rzp_test_`
- Key Secret (revealed when you click "Generate")

**Test it with:**
- UPI: `success@razorpay`
- Card: `4111 1111 1111 1111`

---

## 🔒 **Important Security Notes**

1. ⚠️ **NEVER commit .env file to Git**
2. ✅ `.env` is already in `.gitignore`
3. ✅ Use `.env.example` as template only
4. 🔑 Keep your secret key **SECRET**

---

## 📝 **Example .env File**

```env
# Razorpay Test Keys
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Database (if not already configured)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=saf_portal

# Server
PORT=4901
```

---

## ✅ **Verification Steps**

After adding keys and restarting:

1. Open browser
2. Go to membership form
3. Fill form details
4. Click "Pay ₹20 & Submit"
5. **If configured correctly:**
   - Razorpay modal opens ✅
   - You see payment options ✅
   - Can select UPI/Card ✅

6. **If still error:**
   - Check `.env` file exists in root
   - Check keys are correct (no spaces)
   - Check server restarted
   - Check console logs

---

## 🆘 **Quick Troubleshooting**

### Error: "Cannot read properties of undefined"
**Solution:** Razorpay keys not set. Follow Step 3 above.

### Error: "Invalid key_id or key_secret"
**Solution:** Keys are incorrect. Copy again from dashboard.

### Error: "Payment gateway not configured"
**Solution:** Create `.env` file with keys.

### Modal doesn't open
**Solution:** Check browser console for errors.

---

## 🎯 **Quick Commands**

```bash
# Check if .env exists
dir .env

# Create .env file (Windows PowerShell)
New-Item .env -ItemType File

# Edit .env file
notepad .env

# Restart server
npm start
```

---

## 📞 **Get Help**

- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **Razorpay Docs:** https://razorpay.com/docs/
- **Get API Keys:** https://dashboard.razorpay.com/app/keys
- **Test Credentials:** https://razorpay.com/docs/payments/payments/test-card-upi-details/

---

## ✅ **Checklist**

- [ ] Created Razorpay account
- [ ] Generated test keys
- [ ] Created `.env` file in root
- [ ] Pasted actual keys (not placeholders)
- [ ] Restarted server
- [ ] Tested payment form
- [ ] Payment modal opens
- [ ] Test payment works

---

Once you complete these steps, the payment integration will work perfectly! 🚀









