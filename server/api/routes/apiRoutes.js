var express = require('express');
var router = express.Router();
var std = require(appRoot + '/utils/standardMessages');

/**************************************
 * API ROUTES
 ***************************************/

// Auth2 routes
router.use('/auth2/admin', require(appRoot + '/server/api/routes/auth2/adminAuthRtr'));

// Catch all invalid routes
router.all('*', (req, res) => {
    res.status(std.message["INVALID_ROUTE"].code).send({ 
        "message": std.message["INVALID_ROUTE"].message, 
        "data": null, 
        "errors": [] 
    });
})

module.exports = router;




