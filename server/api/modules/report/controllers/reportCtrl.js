// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);

// Model Inclusions
var reportMdl = require('../models/reportMdl');

/**************************************************************************************
* Controller     : getReportsCtrl
* Parameters     : req, res
* Description    : Get reports with filters (district, mandal, date range, payment method)
***************************************************************************************/
exports.getReportsCtrl = function (req, res) {
    var fnm = "getReportsCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    // Extract filters from query parameters
    var filters = {
        district_id: req.query.district_id || null,
        mandal_id: req.query.mandal_id || null,
        date_from: req.query.date_from || null,
        date_to: req.query.date_to || null,
        payment_method: req.query.payment_method || null
    };

    reportMdl.getReportsMdl(filters)
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No reports found for the selected filters"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};



