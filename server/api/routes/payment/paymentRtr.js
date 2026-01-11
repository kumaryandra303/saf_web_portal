var paymentRtr = require('express').Router();
var paymentCtrl = require('../../modules/payment/controllers/paymentCtrl');

// Create Razorpay order
paymentRtr.post('/create-order', paymentCtrl.createOrderCtrl);

// Verify payment and submit membership
paymentRtr.post('/verify-payment', paymentCtrl.verifyPaymentCtrl);

module.exports = paymentRtr;




