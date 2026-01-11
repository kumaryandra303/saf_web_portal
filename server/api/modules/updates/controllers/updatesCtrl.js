// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var validator = require(appRoot + '/utils/validate.utils');
var path = require('path');
var fs = require('fs');

// Model Inclusions
var updatesMdl = require('../models/updatesMdl');

/**************************************************************************************
* Controller     : getUpdatesListCtrl
* Parameters     : req, res
* Description    : Get list of updates with optional year and month filters
***************************************************************************************/
exports.getUpdatesListCtrl = function (req, res) {
    var fnm = "getUpdatesListCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var filters = {
        year: req.query.year || null,
        month: req.query.month || null
    };

    updatesMdl.getUpdatesListMdl(filters)
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No updates found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getUpdateByIdCtrl
* Parameters     : req, res
* Description    : Get single update by ID
***************************************************************************************/
exports.getUpdateByIdCtrl = function (req, res) {
    var fnm = "getUpdateByIdCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var update_id = req.params.update_id || req.query.update_id;

    if (!update_id) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": 400,
            "err_message": "Update ID is required"
        });
    }

    updatesMdl.getUpdateByIdMdl(update_id)
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results[0], cntxtDtls, fnm, {});
            } else {
                return df.formatErrorRes(res, null, cntxtDtls, fnm, {
                    "error_status": 404,
                    "err_message": "Update not found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : createUpdateCtrl
* Parameters     : req, res
* Description    : Create new update with image uploads
***************************************************************************************/
exports.createUpdateCtrl = function (req, res) {
    var fnm = "createUpdateCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    // Log request data for debugging
    console.log('=== CREATE UPDATE REQUEST ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    console.log('req.files:', req.files);
    console.log('Content-Type:', req.headers['content-type']);

    var reqBody = req.body.data || req.body;
    
    // Log processed body
    console.log('reqBody (processed):', JSON.stringify(reqBody, null, 2));

    // Validate input parameters
    validator.validate_input_params(reqBody, [
        { "field": "updt_ttl_en", "type": "string", "required": true, "name": "Title (English)" },
        { "field": "updt_ttl_te", "type": "string", "required": true, "name": "Title (Telugu)" },
        { "field": "updt_cntnt_en", "type": "string", "required": true, "name": "Content (English)" },
        { "field": "updt_cntnt_te", "type": "string", "required": true, "name": "Content (Telugu)" },
        { "field": "updt_typ_cd", "type": "alpha", "required": true, "name": "Update Type" },
        { "field": "updt_dt", "type": "date", "required": true, "name": "Update Date" }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            return df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, {
                "error_status": n_val.status,
                "err_message": n_val.msg
            });
        } else {
            // Handle image paths (from file uploads)
            var updateData = {
                updt_ttl_en: reqBody.updt_ttl_en,
                updt_ttl_te: reqBody.updt_ttl_te,
                updt_cntnt_en: reqBody.updt_cntnt_en,
                updt_cntnt_te: reqBody.updt_cntnt_te,
                updt_typ_cd: reqBody.updt_typ_cd,
                updt_dt: reqBody.updt_dt,
                img_1_pth: reqBody.img_1_pth || null,
                img_2_pth: reqBody.img_2_pth || null,
                img_3_pth: reqBody.img_3_pth || null,
                crte_usr_id: reqBody.crte_usr_id || req.user?.usr_id || null
            };

            updatesMdl.insertUpdateMdl(updateData)
                .then(function (insertResult) {
                    if (insertResult && insertResult.insertId) {
                        return updatesMdl.getUpdateByIdMdl(insertResult.insertId)
                            .then(function (results) {
                                if (results && results.length > 0) {
                                    return df.formatSucessRes(req, res, results[0], cntxtDtls, fnm, {
                                        "success_msg": "Update created successfully"
                                    });
                                }
                                return df.formatSucessRes(req, res, { id: insertResult.insertId }, cntxtDtls, fnm, {
                                    "success_msg": "Update created successfully"
                                });
                            });
                    } else {
                        return Promise.reject({
                            custom: true,
                            message: "Failed to create update. Please try again."
                        });
                    }
                })
                .catch(function (error) {
                    if (error.custom) {
                        return df.formatErrorRes(res, null, cntxtDtls, null, {
                            "error_status": 400,
                            "err_message": error.message
                        });
                    }
                    return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                });
        }
    });
};

/**************************************************************************************
* Controller     : updateUpdateCtrl
* Parameters     : req, res
* Description    : Update existing update
***************************************************************************************/
exports.updateUpdateCtrl = function (req, res) {
    var fnm = "updateUpdateCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var update_id = req.params.update_id || req.body.update_id;
    var reqBody = req.body.data || req.body;

    if (!update_id) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": 400,
            "err_message": "Update ID is required"
        });
    }

    // Validate input parameters
    validator.validate_input_params(reqBody, [
        { "field": "updt_ttl_en", "type": "string", "required": true, "name": "Title (English)" },
        { "field": "updt_ttl_te", "type": "string", "required": true, "name": "Title (Telugu)" },
        { "field": "updt_cntnt_en", "type": "string", "required": true, "name": "Content (English)" },
        { "field": "updt_cntnt_te", "type": "string", "required": true, "name": "Content (Telugu)" },
        { "field": "updt_typ_cd", "type": "alpha", "required": true, "name": "Update Type" },
        { "field": "updt_dt", "type": "date", "required": true, "name": "Update Date" }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            return df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, {
                "error_status": n_val.status,
                "err_message": n_val.msg
            });
        } else {
            var updateData = {
                updt_ttl_en: reqBody.updt_ttl_en,
                updt_ttl_te: reqBody.updt_ttl_te,
                updt_cntnt_en: reqBody.updt_cntnt_en,
                updt_cntnt_te: reqBody.updt_cntnt_te,
                updt_typ_cd: reqBody.updt_typ_cd,
                updt_dt: reqBody.updt_dt,
                img_1_pth: reqBody.img_1_pth || null,
                img_2_pth: reqBody.img_2_pth || null,
                img_3_pth: reqBody.img_3_pth || null,
                updte_usr_id: reqBody.updte_usr_id || req.user?.usr_id || null
            };

            updatesMdl.updateUpdateMdl(update_id, updateData)
                .then(function (updateResult) {
                    return updatesMdl.getUpdateByIdMdl(update_id)
                        .then(function (results) {
                            if (results && results.length > 0) {
                                return df.formatSucessRes(req, res, results[0], cntxtDtls, fnm, {
                                    "success_msg": "Update updated successfully"
                                });
                            }
                            return df.formatErrorRes(res, null, cntxtDtls, fnm, {
                                "error_status": 404,
                                "err_message": "Update not found"
                            });
                        });
                })
                .catch(function (error) {
                    return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                });
        }
    });
};

/**************************************************************************************
* Controller     : deleteUpdateCtrl
* Parameters     : req, res
* Description    : Delete update (soft delete)
***************************************************************************************/
exports.deleteUpdateCtrl = function (req, res) {
    var fnm = "deleteUpdateCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var update_id = req.params.update_id || req.body.update_id;

    if (!update_id) {
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": 400,
            "err_message": "Update ID is required"
        });
    }

    updatesMdl.deleteUpdateMdl(update_id)
        .then(function (deleteResult) {
            return df.formatSucessRes(req, res, { id: update_id }, cntxtDtls, fnm, {
                "success_msg": "Update deleted successfully"
            });
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

/**************************************************************************************
* Controller     : getAvailableYearsCtrl
* Parameters     : req, res
* Description    : Get available years for filter
***************************************************************************************/
exports.getAvailableYearsCtrl = function (req, res) {
    var fnm = "getAvailableYearsCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    updatesMdl.getAvailableYearsMdl()
        .then(function (results) {
            if (results && results.length > 0) {
                return df.formatSucessRes(req, res, results, cntxtDtls, fnm, {});
            } else {
                return df.formatSucessRes(req, res, [], cntxtDtls, fnm, {
                    "success_msg": "No years found"
                });
            }
        })
        .catch(function (error) {
            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
};

