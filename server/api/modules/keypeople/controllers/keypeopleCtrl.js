// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var keypeopleMdl = require('../models/keypeopleMdl');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);

/**************************************************************************************
* Controller     : getKeyPeopleCtrl
* Parameters     : req, res
* Description    : Get all key people
***************************************************************************************/
exports.getKeyPeopleCtrl = function (req, res) {
    var fnm = "getKeyPeopleCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    keypeopleMdl.getKeyPeopleMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No key people found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getTopKeyPeopleCtrl
* Parameters     : req, res
* Description    : Get top 3 key people for dashboard
***************************************************************************************/
exports.getTopKeyPeopleCtrl = function (req, res) {
    var fnm = "getTopKeyPeopleCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    keypeopleMdl.getTopKeyPeopleMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No key people found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

