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

// Updates routes
router.use('/updates', require(appRoot + '/server/api/routes/updates/updatesRtr'));

// Dashboard routes
router.use('/dashboard', require(appRoot + '/server/api/routes/dashboard/dashboardRtr'));

// Key People routes
router.use('/keypeople', require(appRoot + '/server/api/routes/keypeople/keypeopleRtr'));

// Funds routes
router.use('/funds', require(appRoot + '/server/api/routes/funds/fundsRtr'));

// Catch all invalid routes
router.all('*', (req, res) => {
    res.status(std.message["INVALID_ROUTE"].code).send({ 
        "message": std.message["INVALID_ROUTE"].message, 
        "data": null, 
        "errors": [] 
    });
})

module.exports = router;




