# Razorpay Payment Integration for SAF Sabyam Membership

## ✅ **Implementation Complete!**

This document explains the complete Razorpay payment integration for SAF Sabyam membership registration.

---

## 📋 **Overview**

- **Membership Fee**: ₹20 (one-time registration)
- **Payment Methods**: UPI, Cards, Net Banking, Wallets (Google Pay, PhonePe, Paytm, etc.)
- **Payment Gateway**: Razorpay
- **Flow**: User fills form → Payment → Membership activated

---

## 🗄️ **Database Changes**

### 1. New Payment Transactions Table
Run this SQL file to create the payment transactions table:
```sql
database/saf_payment_transactions.sql
```

### 2. Updated Membership Table
Run this SQL file to update the membership table with payment fields:
```sql
database/saf_membership_table.sql
```

**New columns added to `saf_mmbr_lst_t`:**
- `pymnt_stts` - Payment status (pending/paid/failed)
- `pymnt_trnsctn_id` - Link to payment transaction
- `mmbr_stts` - Membership status (pending/active/inactive)

---

## 🔧 **Backend Setup**

### 1. Install Razorpay SDK
```bash
cd server
npm install razorpay
```

### 2. Configure Razorpay Keys
Create/update `.env` file in server directory:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### 3. Get Razorpay Keys
1. Sign up at https://razorpay.com
2. Go to Dashboard: https://dashboard.razorpay.com/app/keys
3. Copy **Key ID** and **Key Secret**
4. Paste them in `.env` file

### 4. Update Payment Controller
Update the keys in `server/api/modules/payment/controllers/paymentCtrl.js`:
```javascript
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
```

---

## 🎨 **Frontend Setup**

### 1. Razorpay SDK (Auto-loaded)
The Razorpay SDK is automatically loaded via CDN when the form is submitted. No installation needed!

### 2. Environment Variable (Optional)
Create `.env` file in `client/public` directory:
```env
VITE_API_BASE_URL=http://localhost:4901
```

---

## 🔄 **Payment Flow**

### Step-by-Step Process:

1. **User fills membership form** with all required fields
2. **Clicks "Pay ₹20 & Submit"** button
3. **Backend creates Razorpay order** (₹20)
4. **Razorpay payment modal opens** on frontend
5. **User selects payment method:**
   - UPI (Google Pay, PhonePe, Paytm, etc.)
   - Debit/Credit Card
   - Net Banking
   - Wallet
6. **User completes payment** in their app/browser
7. **Razorpay sends callback** with payment details
8. **Backend verifies payment signature** (security check)
9. **If verified:**
   - Check Aadhar uniqueness
   - Create membership record
   - Link payment to member
   - Update statuses to "paid" and "active"
10. **Success message shown** to user

### Payment Failed/Cancelled:
- Error message shown
- User can try again
- Transaction recorded with failed status

---

## 📁 **Files Created/Modified**

### Backend:
- ✅ `database/saf_payment_transactions.sql` - Payment transactions table
- ✅ `database/saf_membership_table.sql` - Updated with payment fields
- ✅ `server/api/modules/payment/models/paymentMdl.js` - Payment model
- ✅ `server/api/modules/payment/controllers/paymentCtrl.js` - Payment controller
- ✅ `server/api/routes/payment/paymentRtr.js` - Payment routes
- ✅ `server/api/routes/apiRoutes.js` - Added payment routes

### Frontend:
- ✅ `client/public/src/services/safService.js` - Added payment APIs
- ✅ `client/public/src/pages/Contact.jsx` - Integrated Razorpay

---

## 🔗 **API Endpoints**

### 1. Create Order
**POST** `/apiv1/payment/create-order`

**Response:**
```json
{
  "status": 200,
  "data": {
    "order_id": "order_xxxxxxxxxxxxx",
    "amount": 20,
    "currency": "INR",
    "key_id": "rzp_test_xxxxxxxxxxxxx"
  }
}
```

### 2. Verify Payment
**POST** `/apiv1/payment/verify-payment`

**Request:**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "xxxxxxxxxxxxx",
  "memberData": {
    "full_name": "John Doe",
    "father_name": "James Doe",
    "dob": "1990-01-01",
    "gender": "male",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main St",
    "district_id": 5,
    "mandal_id": 10,
    "pincode": "533201",
    "aadhar_no": "123456789012",
    "occupation": "Business",
    "education": "Graduate"
  }
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "member_id": 123,
    "payment_id": "pay_xxxxxxxxxxxxx",
    "message": "Payment successful! Membership activated."
  }
}
```

---

## 🎨 **UI Features**

### Payment Info Banner:
- Shows ₹20 membership fee
- Indicates payment methods available

### Submit Button:
- Shows "Pay ₹20 & Submit Application"
- Loading state with spinner during processing
- Disabled while processing

### Success/Error Messages:
- Green banner for success
- Red banner for errors
- Auto-scroll to message

### Payment Modal:
- Razorpay branded modal
- SAF logo and name
- Red theme color
- Pre-filled user details

---

## 🧪 **Testing**

### Test Mode (Razorpay Test Keys):
Use these test credentials for UPI:
- **UPI ID**: success@razorpay
- **Status**: Success

Use these test cards:
- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Success**: Will succeed
- **Failure Card**: 4111 1111 1111 1112

### Test Flow:
1. Fill membership form with test data
2. Click Pay button
3. Select UPI in Razorpay modal
4. Enter `success@razorpay` as UPI ID
5. Click Pay
6. Payment will succeed
7. Membership created

---

## 🔒 **Security Features**

1. **Signature Verification**: Every payment is verified using HMAC SHA256
2. **Server-side Validation**: All checks happen on backend
3. **Aadhar Uniqueness**: Prevents duplicate registrations
4. **Transaction Logging**: All payments logged in database
5. **HTTPS Required**: Use HTTPS in production

---

## 🚀 **Production Deployment**

### 1. Switch to Live Keys:
- Login to Razorpay Dashboard
- Activate your account (KYC required)
- Get **Live Keys** from Keys section
- Update `.env` with live keys

### 2. Update Environment:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_here
```

### 3. Enable HTTPS:
- Razorpay requires HTTPS in production
- Use SSL certificate (Let's Encrypt free)

### 4. Test Thoroughly:
- Test all payment methods
- Test failure scenarios
- Check database entries

---

## 📊 **Database Tables**

### saf_pymnt_trnsctn_t (Payment Transactions)
Stores all payment details:
- Razorpay order ID, payment ID, signature
- Payment amount, currency, status
- Payment method (UPI/Card/etc.)
- UPI ID, bank name, card details
- Full response JSON
- Error messages if failed

### saf_mmbr_lst_t (Membership)
Updated with:
- Payment status
- Payment transaction ID link
- Membership status
- All member details

---

## ❓ **Troubleshooting**

### Payment Modal Not Opening:
- Check browser console for errors
- Ensure Razorpay SDK loaded (check Network tab)
- Check API is returning order_id

### Payment Verification Failed:
- Check Razorpay secret key is correct
- Verify signature calculation logic
- Check database for transaction entry

### Aadhar Already Exists:
- This is expected behavior
- Check database for existing member
- Each Aadhar can register only once

---

## 📞 **Support**

- **Razorpay Docs**: https://razorpay.com/docs/
- **Razorpay Dashboard**: https://dashboard.razorpay.com/
- **Test Payment Methods**: https://razorpay.com/docs/payments/payments/test-card-upi-details/

---

## ✅ **Implementation Checklist**

- [x] Database tables created
- [x] Backend payment module created
- [x] Razorpay SDK installed in backend
- [x] Payment routes added
- [x] Frontend payment integration
- [x] Razorpay modal integrated
- [x] Payment verification logic
- [x] Error handling
- [x] Success/failure messages
- [x] Transaction logging
- [x] Signature verification
- [x] Aadhar uniqueness check
- [x] Member activation after payment

---

## 🎉 **Result**

Users can now:
1. Fill the SAF Sabyam membership form
2. Pay ₹20 via UPI/Card/Net Banking
3. Get instant membership activation
4. Receive confirmation message

All transactions are securely recorded and verified! 🚀


