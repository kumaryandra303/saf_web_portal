// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var dashboardMdl = require('../models/dashboardMdl');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);

/**************************************************************************************
* Controller     : getDashboardStatsCtrl
* Parameters     : req, res
* Description    : Get dashboard statistics
***************************************************************************************/
exports.getDashboardStatsCtrl = function (req, res) {
    var fnm = "getDashboardStatsCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    dashboardMdl.getDashboardStatsMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results[0], cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, {
                    total_members: 0,
                    paid_members: 0,
                    total_donations: 0,
                    donors_count: 0,
                    total_updates: 0,
                    saf_funds: 0,
                    total_programs: 0
                }, cntxtDtls, fnm, {});
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getTopMembersCtrl
* Parameters     : req, res
* Description    : Get top 3 main members
***************************************************************************************/
exports.getTopMembersCtrl = function (req, res) {
    var fnm = "getTopMembersCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    dashboardMdl.getTopMembersMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No members found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getDistrictWiseStatsCtrl
* Parameters     : req, res
* Description    : Get district-wise statistics
***************************************************************************************/
exports.getDistrictWiseStatsCtrl = function (req, res) {
    var fnm = "getDistrictWiseStatsCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    dashboardMdl.getDistrictWiseStatsMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No district data found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

