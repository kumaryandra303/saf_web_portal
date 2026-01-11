// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);

// Model Inclusions
var adminMdl = require('../models/adminMdl');

/**************************************************************************************
* Controller     : getMandalsCtrl
* Parameters     : req, res
* Description    : Get list of all mandals (optionally filtered by district_id)
***************************************************************************************/
exports.getMandalsCtrl = function (req, res) {
    var fnm = "getMandalsCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    // Get district_id from query params or route params
    var dstrt_id = req.query.district_id || req.params.district_id || null;

    adminMdl.getMandalsListMdl(dstrt_id)
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, { 
                    "success_msg": "No mandals found" 
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getDistrictsCtrl
* Parameters     : req, res
* Description    : Get list of all districts
***************************************************************************************/
exports.getDistrictsCtrl = function (req, res) {
    var fnm = "getDistrictsCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    adminMdl.getDistrictsListMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return req.status(200).json({
                    status: 200,
                    data: results,
                    message: 'Districts fetched successfully'
                });
            } else {
                return req.status(200).json({
                    status: 200,
                    data: [],
                    message: 'No districts found'
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

