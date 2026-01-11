// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var fundsMdl = require('../models/fundsMdl');
var validator = require(appRoot + '/utils/validate.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);

/**************************************************************************************
* Controller     : getFundsListCtrl
* Parameters     : req, res
* Description    : Get funds list with optional filters
***************************************************************************************/
exports.getFundsListCtrl = function (req, res) {
    var fnm = "getFundsListCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var filters = {
        payment_method: req.query.payment_method || null,
        payment_status: req.query.payment_status || null,
        district_id: req.query.district_id || null,
        date_from: req.query.date_from || null,
        date_to: req.query.date_to || null
    };

    fundsMdl.getFundsListMdl(filters)
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No funds found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getFundByIdCtrl
* Parameters     : req, res
* Description    : Get single fund by ID
***************************************************************************************/
exports.getFundByIdCtrl = function (req, res) {
    var fnm = "getFundByIdCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var fund_id = req.params.fund_id;

    if (!fund_id) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": std.message.INVALID_DATA_FORMAT.code,
            "err_message": "Fund ID is required"
        });
    }

    fundsMdl.getFundByIdMdl(fund_id)
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results[0], cntxtDtls, fnm, {});
            } else {
                return df.formatErrorRes(res, null, cntxtDtls, fnm, {
                    "error_status": std.message.NO_DATA_FOUND.code,
                    "err_message": "Fund not found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : createFundCtrl
* Parameters     : req, res
* Description    : Create new fund record
***************************************************************************************/
exports.createFundCtrl = function (req, res) {
    var fnm = "createFundCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);
    
    // Debug logging
    console.log('=== createFundCtrl: Received request ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    console.log('req.body keys:', Object.keys(req.body || {}));
    // Validate required fields
    if (!req.body.donor_name || !req.body.fund_amount || !req.body.payment_method) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": std.message.INVALID_DATA_FORMAT.code,
            "err_message": "Donor name, fund amount, and payment method are required"
        });
    }

    var fundData = {
        donor_name: req.body.donor_name,
        donor_phone: req.body.donor_phone || null,
        donor_email: req.body.donor_email || null,
        fund_amount: parseFloat(req.body.fund_amount),
        payment_method: req.body.payment_method,
        upi_id: req.body.upi_id || null,
        transaction_id: req.body.transaction_id || null,
        bank_name: req.body.bank_name || null,
        cheque_no: req.body.cheque_no || null,
        payment_status: req.body.payment_status || 'completed',
        district_id: req.body.district_id || null,
        mandal_id: req.body.mandal_id || null,
        description: req.body.description || null,
        receipt_image_path: req.body.receipt_image_path || null,
        payment_date: req.body.payment_date || null
    };

    fundsMdl.insertFundMdl(fundData)
        .then(function (result) {
            if (result && result.insertId) {
                return df.formatSucessRes(req, res, { fund_id: result.insertId }, cntxtDtls, fnm, {
                    "success_msg": "Fund added successfully"
                });
            } else {
                return df.formatErrorRes(res, null, cntxtDtls, fnm, {
                    "error_status": std.message.INSERT_FAILED.code,
                    "err_message": "Failed to add fund"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : updateFundCtrl
* Parameters     : req, res
* Description    : Update fund record
***************************************************************************************/
exports.updateFundCtrl = function (req, res) {
    var fnm = "updateFundCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var fund_id = req.params.fund_id;

    if (!fund_id) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": std.message.INVALID_DATA_FORMAT.code,
            "err_message": "Fund ID is required"
        });
    }

    if (!req.body.donor_name || !req.body.fund_amount || !req.body.payment_method) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": std.message.INVALID_DATA_FORMAT.code,
            "err_message": "Donor name, fund amount, and payment method are required"
        });
    }

    var fundData = {
        donor_name: req.body.donor_name,
        donor_phone: req.body.donor_phone || null,
        donor_email: req.body.donor_email || null,
        fund_amount: parseFloat(req.body.fund_amount),
        payment_method: req.body.payment_method,
        upi_id: req.body.upi_id || null,
        transaction_id: req.body.transaction_id || null,
        bank_name: req.body.bank_name || null,
        cheque_no: req.body.cheque_no || null,
        payment_status: req.body.payment_status || 'completed',
        district_id: req.body.district_id || null,
        mandal_id: req.body.mandal_id || null,
        description: req.body.description || null,
        receipt_image_path: req.body.receipt_image_path || null,
        payment_date: req.body.payment_date || null
    };

    fundsMdl.updateFundMdl(fund_id, fundData)
        .then(function (result) {
            if (result && result.affectedRows > 0) {
                return df.formatSucessRes(req, res, { fund_id: fund_id }, cntxtDtls, fnm, {
                    "success_msg": "Fund updated successfully"
                });
            } else {
                return df.formatErrorRes(res, null, cntxtDtls, fnm, {
                    "error_status": std.message.UPDATE_FAILED.code,
                    "err_message": "Fund not found or update failed"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : deleteFundCtrl
* Parameters     : req, res
* Description    : Delete fund record (soft delete)
***************************************************************************************/
exports.deleteFundCtrl = function (req, res) {
    var fnm = "deleteFundCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var fund_id = req.params.fund_id;

    if (!fund_id) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": std.message.INVALID_DATA_FORMAT.code,
            "err_message": "Fund ID is required"
        });
    }

    fundsMdl.deleteFundMdl(fund_id)
        .then(function (result) {
            if (result && result.affectedRows > 0) {
                return df.formatSucessRes(req, res, { fund_id: fund_id }, cntxtDtls, fnm, {
                    "success_msg": "Fund deleted successfully"
                });
            } else {
                return df.formatErrorRes(res, null, cntxtDtls, fnm, {
                    "error_status": std.message.DELETE_FAILED.code,
                    "err_message": "Fund not found or delete failed"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getTotalFundsCtrl
* Parameters     : req, res
* Description    : Get total funds statistics
***************************************************************************************/
exports.getTotalFundsCtrl = function (req, res) {
    var fnm = "getTotalFundsCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    fundsMdl.getTotalFundsMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results[0], cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, {
                    total_funds: 0,
                    total_donations: 0,
                    total_donors: 0
                }, cntxtDtls, fnm, {});
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

