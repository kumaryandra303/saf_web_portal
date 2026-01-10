var express = require('express');
var router = express.Router();
var std = require(appRoot + '/utils/standardMessages');

/**************************************
 * API ROUTES
 ***************************************/

// Auth2 routes
router.use('/auth2/admin', require(appRoot + '/server/api/routes/auth2/adminAuthRtr'));

// Admin routes
router.use('/admin', require(appRoot + '/server/api/routes/admin/adminRtr'));

// SAF routes
router.use('/saf', require(appRoot + '/server/api/routes/saf/safRtr'));

// Payment routes
router.use('/payment', require(appRoot + '/server/api/routes/payment/paymentRtr'));

// Catch all invalid routes
router.all('*', (req, res) => {
    res.status(std.message["INVALID_ROUTE"].code).send({ 
        "message": std.message["INVALID_ROUTE"].message, 
        "data": null, 
        "errors": [] 
    });
})

module.exports = router;




