var adminAuthRtr = require('express').Router();
var authCtrl = require('../../modules/auth2/controllers/adminAuth2Ctrl');

// Login routes
adminAuthRtr.post('/login', authCtrl.userLoginCtrl);
adminAuthRtr.get('/login/captcha', authCtrl.generateCaptchaCntrl);

// Forgot password routes
adminAuthRtr.post('/forgot-password/send-otp', authCtrl.emply_snd_otpC);
adminAuthRtr.post('/forgot-password/resend-otp', authCtrl.emply_resnd_otpC);
adminAuthRtr.post('/forgot-password/validate-otp', authCtrl.emply_vldt_otpC);

// Logout route
adminAuthRtr.get('/logout', authCtrl.logoutC);

// Salt key route
adminAuthRtr.get('/saltkey', authCtrl.getSaltKeyCtrl);

// Roles routes
adminAuthRtr.get('/roles', authCtrl.getUsrRolesLstCtrl);

module.exports = adminAuthRtr;

