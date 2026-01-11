// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var validator = require(appRoot + '/utils/validate.utils');

// Model Inclusions
var safMdl = require('../models/safMdl');

/**************************************************************************************
* Controller     : submitMembershipCtrl
* Parameters     : req, res
* Description    : Submit SAF membership form with validation
***************************************************************************************/
exports.submitMembershipCtrl = function (req, res) {
    var fnm = "submitMembershipCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var reqBody = req.body.data || req.body;

    // Validate input parameters
    validator.validate_input_params(reqBody, [
        { "field": "full_name", "type": "alpha", "required": true, "name": "Full Name" },
        { "field": "father_name", "type": "alpha", "required": true, "name": "Father Name" },
        { "field": "dob", "type": "date", "required": true, "name": "Date of Birth" },
        { "field": "gender", "type": "alpha", "required": true, "name": "Gender" },
        { "field": "phone", "type": "phone", "required": true, "name": "Phone Number" },
        { "field": "email", "type": "email", "required": false, "name": "Email" },
        { "field": "address", "type": "string", "required": true, "name": "Address" },
        { "field": "district_id", "type": "int", "required": true, "name": "District" },
        { "field": "mandal_id", "type": "int", "required": true, "name": "Mandal" },
        { "field": "pincode", "type": "pincode", "required": true, "name": "Pincode" },
        { "field": "aadhar_no", "type": "aadhar", "required": true, "name": "Aadhar Number" },
        { "field": "occupation", "type": "alpha", "required": false, "name": "Occupation" },
        { "field": "education", "type": "alpha", "required": false, "name": "Education" }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            return df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, {
                "error_status": n_val.status,
                "err_message": n_val.msg
            });
        } else {
            // Check if Aadhar already exists
            safMdl.checkAadharExistsMdl(reqBody.aadhar_no)
                .then(function (results) {
                    if (results && results.length > 0) {
                        // Aadhar already exists
                        return df.formatErrorRes(res, null, cntxtDtls, null, {
                            "error_status": 400,
                            "err_message": `Aadhar number already registered. Member: ${results[0].fll_nm}, Phone: ${results[0].phne_no}`
                        });
                    } else {
                        // Insert new membership
                        safMdl.insertMembershipMdl(reqBody)
                            .then(function (insertResult) {
                                if (insertResult && insertResult.insertId) {
                                    return df.formatSucessRes(req, res, {
                                        member_id: insertResult.insertId,
                                        message: "Membership registration successful!"
                                    }, cntxtDtls, fnm, {
                                        "success_msg": "Thank you for joining SAF Sabyam!"
                                    });
                                } else {
                                    return df.formatErrorRes(res, null, cntxtDtls, fnm, {
                                        "err_message": "Failed to register membership. Please try again."
                                    });
                                }
                            })
                            .catch(function (error) {
                                return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                            });
                    }
                })
                .catch(function (error) {
                    return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                });
        }
    });
};

/**************************************************************************************
* Controller     : getMembersListCtrl
* Parameters     : req, res
* Description    : Get SAF members list with optional district and mandal filters
***************************************************************************************/
exports.getMembersListCtrl = function (req, res) {
    var fnm = "getMembersListCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var filters = {
        district_id: req.query.district_id || null,
        mandal_id: req.query.mandal_id || null
    };

    safMdl.getMembersListMdl(filters)
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
* Controller     : adminRegisterMemberCtrl
* Parameters     : req, res
* Description    : Admin registers SAF member with payment details (Cash/UPI)
***************************************************************************************/
exports.adminRegisterMemberCtrl = function (req, res) {
    var fnm = "adminRegisterMemberCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var reqBody = req.body.data || req.body;

    // Validate input parameters
    validator.validate_input_params(reqBody, [
        { "field": "full_name", "type": "alpha", "required": true, "name": "Full Name" },
        { "field": "father_name", "type": "alpha", "required": true, "name": "Father Name" },
        { "field": "dob", "type": "date", "required": true, "name": "Date of Birth" },
        { "field": "gender", "type": "alpha", "required": true, "name": "Gender" },
        { "field": "phone", "type": "phone", "required": true, "name": "Phone Number" },
        { "field": "email", "type": "email", "required": false, "name": "Email" },
        { "field": "address", "type": "string", "required": true, "name": "Address" },
        { "field": "district_id", "type": "int", "required": true, "name": "District" },
        { "field": "mandal_id", "type": "int", "required": true, "name": "Mandal" },
        { "field": "pincode", "type": "pincode", "required": true, "name": "Pincode" },
        { "field": "aadhar_no", "type": "aadhar", "required": true, "name": "Aadhar Number" },
        { "field": "occupation", "type": "alpha", "required": false, "name": "Occupation" },
        { "field": "education", "type": "alpha", "required": false, "name": "Education" },
        { "field": "payment_type", "type": "alpha", "required": true, "name": "Payment Type" }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            return df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, {
                "error_status": n_val.status,
                "err_message": n_val.msg
            });
        } else {
            // Check if Aadhar already exists
            safMdl.checkAadharExistsMdl(reqBody.aadhar_no)
                .then(function (results) {
                    if (results && results.length > 0) {
                        // Aadhar already exists
                        return Promise.reject({
                            custom: true,
                            message: `Aadhar number already registered. Member: ${results[0].fll_nm}, Phone: ${results[0].phne_no}`
                        });
                    }
                    
                    // Insert new membership
                    return safMdl.insertMembershipMdl(reqBody);
                })
                .then(function (insertResult) {
                    if (insertResult && insertResult.insertId) {
                        const member_id = insertResult.insertId;
                        
                        // Insert payment transaction for admin registration
                        const paymentData = {
                            member_id: member_id,
                            payment_type: reqBody.payment_type,
                            payment_method: reqBody.payment_type === 'upi' ? 'upi' : 'cash',
                            upi_id: reqBody.upi_id || null,
                            amount: 20,
                            status: 'paid',
                            admin_registered: 1
                        };
                        
                        return safMdl.insertAdminPaymentMdl(paymentData)
                            .then(function(paymentResult) {
                                if (paymentResult && paymentResult.insertId) {
                                    // Link payment to member
                                    return safMdl.linkPaymentToMemberMdl(member_id, paymentResult.insertId)
                                        .then(function() {
                                            return {
                                                member_id: member_id,
                                                payment_id: paymentResult.insertId
                                            };
                                        });
                                }
                                return { member_id: member_id };
                            });
                    } else {
                        return Promise.reject({
                            custom: true,
                            message: "Failed to register membership. Please try again."
                        });
                    }
                })
                .then(function (data) {
                    return df.formatSucessRes(req, res, {
                        member_id: data.member_id,
                        payment_id: data.payment_id,
                        message: "Member registered successfully!"
                    }, cntxtDtls, fnm, {
                        "success_msg": "Member registration completed."
                    });
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

