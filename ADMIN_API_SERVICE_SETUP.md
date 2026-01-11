# 🔧 Admin Portal API Service Setup

## ✅ **Complete!**

I've created a `baseApiService.js` for the admin portal that matches the structure of the public portal's API service, with additional admin-specific features.

---

## 📁 **File Created:**

### **`client/admin/src/services/baseApiService.js`**

**Structure:** Same as public portal's `baseApiService.js`

**Features:**
- ✅ Same method structure (post, get, put, delete)
- ✅ Same Promise-based API
- ✅ Same interceptors pattern
- ✅ **Plus:** Auth token handling (from localStorage)
- ✅ **Plus:** 401 redirect to login
- ✅ **Plus:** Admin-specific error handling

---

## 🔄 **Key Differences from Public Portal:**

### **Public Portal (`client/public/src/services/baseApiService.js`):**
```javascript
- No auth token handling
- Simple error logging
- Basic interceptors
```

### **Admin Portal (`client/admin/src/services/baseApiService.js`):**
```javascript
- ✅ Auth token from localStorage
- ✅ Token added to headers: 'x-access-token'
- ✅ 401 redirect to /login
- ✅ Clears admin tokens on unauthorized
- ✅ Enhanced error handling
```

---

## 📋 **API Service Methods:**

### **1. POST Request:**
```javascript
import baseApiService from '../../services/baseApiService';

const response = await baseApiService.post('/saf/admin/register-member', formData);
// Returns: { status: 200, data: {...}, ... }
```

### **2. GET Request:**
```javascript
const response = await baseApiService.get('/admin/get/districts');
// Returns: { status: 200, data: [...] }
```

### **3. PUT Request:**
```javascript
const response = await baseApiService.put('/route', data);
```

### **4. DELETE Request:**
```javascript
const response = await baseApiService.delete('/route');
```

---

## 🔐 **Auth Token Handling:**

### **Automatic Token Injection:**
The service automatically adds the admin token from localStorage:

```javascript
// Request interceptor
const token = localStorage.getItem('saf_admin_token');
if (token) {
  config.headers['x-access-token'] = token;
}
```

### **401 Unauthorized Handling:**
If the server returns 401 (Unauthorized):
1. Clears `saf_admin_user` from localStorage
2. Clears `saf_admin_token` from localStorage
3. Redirects to `/login`

---

## 🔄 **Updated Files:**

### **1. `client/admin/src/pages/dashboard/SAFMembers.jsx`**
**Before:**
```javascript
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://settibalijaactionforce.com';

const response = await axios.get(`${API_BASE_URL}/apiv1/admin/get/districts`);
```

**After:**
```javascript
import baseApiService from '../../services/baseApiService';

const response = await baseApiService.get('/admin/get/districts');
```

**Benefits:**
- ✅ Cleaner code (no manual URL construction)
- ✅ Automatic auth token injection
- ✅ Consistent error handling
- ✅ Automatic 401 redirect

---

## 📊 **API Routes Used:**

### **Current Routes in SAFMembers:**
1. ✅ `GET /admin/get/districts`
2. ✅ `GET /admin/get/mandals/:district_id`
3. ✅ `GET /saf/members/list`
4. ✅ `POST /saf/admin/register-member`

All routes now use `baseApiService` instead of direct axios calls.

---

## 🎯 **Configuration:**

### **Environment Variables:**
```javascript
// .env file
VITE_API_BASE_URL=https://settibalijaactionforce.com
```

### **API Prefix:**
```javascript
const API_PREFIX = '/apiv1';
// Full URL: https://settibalijaactionforce.com/apiv1
```

### **Base URL Construction:**
```javascript
baseURL: `${API_BASE_URL}${API_PREFIX}`
// Example: https://settibalijaactionforce.com/apiv1
```

---

## 🔍 **Error Handling:**

### **Response Structure:**
```javascript
// Success Response
{
  status: 200,
  data: [...],
  success_msg: "..."
}

// Error Response
{
  status: 400,
  err_message: "Error message",
  errors: {...}
}
```

### **Error Handling in Components:**
```javascript
try {
  const response = await baseApiService.get('/route');
  if (response.status === 200) {
    // Handle success
  }
} catch (error) {
  // error.err_message - User-friendly message
  // error.errors - Validation errors
  // error.status - HTTP status code
}
```

---

## 📝 **Usage Examples:**

### **Example 1: Fetch Districts**
```javascript
const fetchDistricts = async () => {
  try {
    const response = await baseApiService.get('/admin/get/districts');
    if (response.status === 200) {
      setDistricts(response.data);
    }
  } catch (error) {
    console.error('Error:', error.err_message);
  }
};
```

### **Example 2: Register Member**
```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await baseApiService.post('/saf/admin/register-member', formData);
    if (response.status === 200) {
      // Success
      console.log('Member registered:', response.data);
    }
  } catch (error) {
    // Error
    console.error('Registration failed:', error.err_message);
  }
};
```

### **Example 3: With Query Parameters**
```javascript
const params = new URLSearchParams();
params.append('district_id', '5');
params.append('mandal_id', '10');

const route = `/saf/members/list?${params}`;
const response = await baseApiService.get(route);
```

---

## 🔄 **Migration from Direct Axios:**

### **Before (Direct Axios):**
```javascript
import axios from 'axios';
const API_BASE_URL = 'https://settibalijaactionforce.com';

// Manual URL construction
const response = await axios.get(`${API_BASE_URL}/apiv1/admin/get/districts`);

// Manual token handling
const token = localStorage.getItem('saf_admin_token');
const config = {
  headers: { 'x-access-token': token }
};
const response = await axios.post(url, data, config);
```

### **After (baseApiService):**
```javascript
import baseApiService from '../../services/baseApiService';

// Clean route (no base URL needed)
const response = await baseApiService.get('/admin/get/districts');

// Token automatically added
const response = await baseApiService.post('/saf/admin/register-member', data);
```

**Benefits:**
- ✅ Less code
- ✅ Consistent API calls
- ✅ Automatic auth handling
- ✅ Better error handling
- ✅ Centralized configuration

---

## ✅ **Summary:**

### **What's Done:**
1. ✅ Created `baseApiService.js` matching public portal structure
2. ✅ Added admin-specific auth token handling
3. ✅ Added 401 redirect functionality
4. ✅ Updated SAFMembers component to use new service
5. ✅ Removed direct axios imports
6. ✅ Cleaner, more maintainable code

### **Files:**
- ✅ `client/admin/src/services/baseApiService.js` (NEW)
- ✅ `client/admin/src/pages/dashboard/SAFMembers.jsx` (UPDATED)

### **Benefits:**
- ✅ Consistent API structure across portals
- ✅ Automatic auth token injection
- ✅ Better error handling
- ✅ Cleaner component code
- ✅ Easier maintenance

---

## 🚀 **Next Steps (Optional):**

If you have other components using direct axios, you can migrate them:

1. Replace `import axios from 'axios'` with `import baseApiService from '../../services/baseApiService'`
2. Replace `axios.get(url)` with `baseApiService.get(route)`
3. Remove manual URL construction
4. Remove manual token handling

**The admin portal now has a professional, consistent API service!** 🎉



