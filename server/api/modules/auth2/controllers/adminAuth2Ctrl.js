// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var jsonUtils = require(appRoot + '/utils/json.utils');
var jwt = require('jsonwebtoken');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var validator = require(appRoot + '/utils/validate.utils');
var _ = require('lodash');
var moment = require('moment');

// Model Inclusions
var authMdl = require('../models/adminAuth2Mdl');
var localStorage = require('localStorage')
var emailUtils = require(appRoot + '/utils/email.utils');
var svgCaptcha = require('svg-captcha');
var captchMdl = require(appRoot + '/server/api/modules/captcha/model/captchaMdl.js');
var crypto = require('crypto');

/**************************************************************************************
* Controller     : userLoginCtrl
* Parameters     : req, res
* Description    : User login with captcha validation
***************************************************************************************/
exports.userLoginCtrl = function (req, res) {
    var fnm = "userLogin";
    // log.message("INFO", cntxtDtls, 100, `In ${fnm}`);

    let reqBody;
    var usr_mnu_prfle;
    var usr_stp_prfle;
    var usr_rpt_prfle;
    var usr_hlp_prfle;
    var usr_rle_id;
    var usr_rle_nm;
    var dsgns_id;
    var dsgns_nm;
    var mnu_home_pg;
    
    if (req.body['data']) {
        reqBody = req.body.data;
    }
    else {
        reqBody = req.body;
    }
    
    validator.validate_input_params(reqBody, [
        { "field": "username", "type": "username", "required": true },
        { "field": "password", "type": "saltedhash", "name": "Password", "required": true },
        { "field": "captcha", "type": "capcha", "required": true, "name": "Capcha" },
        { "field": "captchaID", "type": "int", "name": "captchaID", "required": true },
        { "field": "app", "type": "alpha", "name": "app", "required": true }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            return df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, { 
                "error_status": n_val.status, 
                "err_message": n_val.msg 
            });
        } else {
            validateCaptch(reqBody['captcha'], reqBody['captchaID'], (cptch_err, cpthc_res) => {
                if (!cptch_err) {
                    captchMdl.deactivateValidatedCaptchaMdl(reqBody['captchaID']).then(function (cpth_vld_res) {
                        authMdl.loginMdl(reqBody).then(function (results) {
                            if (results.length > 0) {
                                let cmpnt_ctgry_id = (reqBody.app == 'web') ? 1 : 2;
                                authMdl.recordLoginHistoryMdl({ 
                                    usr_id: results[0].usr_id, 
                                    cmpnt_ctgry_id: cmpnt_ctgry_id, 
                                    ctzn_in: 0, 
                                    clnt_id: results[0].clnt_id, 
                                    tnt_id: results[0].tnt_id 
                                })
                                
                                var data = {
                                    user: results[0]
                                }
                                
                                authMdl.getUsrClntsMdl(data.user).then((result) => {
                                    if (result.length > 0) {
                                        usr_rle_id = result[0].rle_id;
                                        usr_rle_nm = result[0].rle_nm;
                                        var usr_admn_rle_in = result[0].admn_rle_in;
                                        dsgns_id = result[0].dsgns_id;
                                        dsgns_nm = result[0].dsgns_nm;
                                        var clnt_id = result[0].clnt_id;
                                        var tnt_id = result[0].tnt_id;
                                        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

                                        authMdl.getUsrAsgndPrflesMdl(clnt_id, tnt_id, usr_rle_id).then((usrAsgndPrfleRes) => {
                                            for (var u = 0; u < usrAsgndPrfleRes.length; u++) {
                                                if (usrAsgndPrfleRes[u].prfle_ctgry_nm == 'Menu Profile') {
                                                    usr_mnu_prfle = usrAsgndPrfleRes[u].prfle_id;
                                                    mnu_home_pg = usrAsgndPrfleRes[u].prfle_dshbd_url_tx;
                                                }
                                                if (usrAsgndPrfleRes[u].prfle_ctgry_nm == 'Setup Profile') {
                                                    usr_stp_prfle = usrAsgndPrfleRes[u].prfle_id;
                                                }
                                                if (usrAsgndPrfleRes[u].prfle_ctgry_nm == 'Report Profile') {
                                                    usr_rpt_prfle = usrAsgndPrfleRes[u].prfle_id;
                                                }
                                                if (usrAsgndPrfleRes[u].prfle_ctgry_nm == 'Help Profile') {
                                                    usr_hlp_prfle = usrAsgndPrfleRes[u].prfle_id;
                                                }
                                            }
                                            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

                                            if (result && result.length) {
                                                data.clnts = jsonUtils.groupJsonByKey(
                                                    result, 
                                                    ['clnt_id', 'clnt_nm', 'clnt_dsply_nm'], 
                                                    ['tnt_id', 'tnt_nm', 'tnt_dsply_nm'], 
                                                    'tnts', 
                                                    'clnt_id'
                                                );
                                                
                                                data.assignedProfiles = { 
                                                    mnu_prfle: usr_mnu_prfle, 
                                                    stp_prfle: usr_stp_prfle == undefined ? '' : usr_stp_prfle, 
                                                    rpt_prfle: usr_rpt_prfle, 
                                                    hlp_prfle: usr_hlp_prfle, 
                                                    mnu_home_pg: mnu_home_pg 
                                                };
                                                
                                                data.user.roles = { 
                                                    rle_id: usr_rle_id, 
                                                    rle_nm: usr_rle_nm, 
                                                    admn_rle_in: usr_admn_rle_in 
                                                }
                                                
                                                data.user.dsgns = { 
                                                    dsgns_id: dsgns_id, 
                                                    dsgns_nm: dsgns_nm 
                                                }
                                            }
                                            var accessToken = jwt.sign({
                                                usr_id: data.user.usr_id,
                                                assignedRole: data.user.roles,
                                                clnt: data.clnts[0],
                                                assignedProfiles: { 
                                                    mnu_prfle: usr_mnu_prfle, 
                                                    stp_prfle: usr_stp_prfle == undefined ? '' : usr_stp_prfle, 
                                                    rpt_prfle: usr_rpt_prfle, 
                                                    hlp_prfle: usr_hlp_prfle 
                                                },
                                                origin: req.headers['origin'],
                                                host: req.headers['host'],
                                                tnt_id: data.user.tnt_id,
                                                clnt_id: data.user.clnt_id
                                            }, appSettings.app.session_sec_key, appSettings.app.jwt_options);

                                            var clnt_tnt = {
                                                clnt_id: data.clnts[0].clnt_id,
                                                tnt_id: data.clnts[0].tnts[0].tnt_id
                                            }

                                            req.session.usr_id = data.user.usr_id;
                                            req.session.app = req.isMobile ? 'app' : 'web';
                                            req.session.jwtToken = accessToken;
                                            let random_number = Math.floor(100000 + Math.random() * 900000);
                                            req.session.qrcode = random_number;
                                            data.qrcode = random_number;
                                            console.log('ccccccccccccccccccccccccccccccccccccccccccccccccccccccccc')

                                            authMdl.expr_prvs_sesnsM({ 
                                                usr_id: req.session.usr_id, 
                                                app: req.session.app 
                                            }).then((results) => {
                                                console.log('dddddddddddddddddddddddddddddddddddddddddddddddddddddddd')
                                                sessionStore.set(req.sessionID, req.session, (err, results) => {
                                                    if (err) {
                                                        df.formatErrorRes(res, err, cntxtDtls, fnm, {});
                                                        return;
                                                    }
                                                    else {
                                                        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                                                        localStorage.setItem('nodeclnttnt', JSON.stringify(clnt_tnt));
                                                        res.setHeader('x-access-token', accessToken);
                                                      return  res.status(200).json({
                                                            status: 200,
                                                                data: {
                                                                    user: data.user,
                                                                    clnts: data.clnts,
                                                                    assignedProfiles: data.assignedProfiles,
                                                                    qrcode: data.qrcode
                                                                },
                                                            message: 'Login successful'
                                                        });
                                                    }
                                                });
                                            }).catch(error => {
                                                console.log('fffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                                                return res.status(500).json({
                                                    status: 500,
                                                    data: null,
                                                    message: 'Error in login'
                                                });
                                            }).catch(error => {
                                                console.log('gggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
                                                return res.status(500).json({
                                                    status: 500,
                                                    data: null,
                                                    message: 'Error in login'
                                                });
                                            })

                                        })
                                    } else {
                                        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
                                        return res.status(401).json({
                                            status: 401,
                                            data: null,
                                            message: 'Unauthorized access'
                                        });
                                    }
                                }, function (error) {
                                    console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
                                    return res.status(500).json({
                                        status: 500,
                                        data: null,
                                        message: 'Error in login'
                                    });
                                });

                            } else {
                                console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
                                return res.status(401).json({
                                    status: 401,
                                    data: null,
                                    message: 'Invalid credentials'
                                });
                            }

                        })
                        .catch(function (error) {
                           return res.status(500).json({
                            status: 500,
                            data: null,
                            message: 'Error in login'
                           });
                        });
                    })

                }
                else {
                    return res.status(400).json({
                        status: 400,
                        data: null,
                        message: 'Invalid captcha'
                    });
                }
            });
        }
    });
}

/**************************************************************************************
* Controller     : generateCaptchaCntrl
* Parameters     : req, res
* Description    : Generate captcha for login
***************************************************************************************/
var genSaltKey = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

exports.generateCaptchaCntrl = function (req, res) {
    var fnm = "generateCaptchaCntrl";
    // log.message("INFO", cntxtDtls, 100, `In ${fnm}`);
    
    try {
        var captcha = svgCaptcha.create({
            Width: 100,
            Height: 50,
            noise: 2,
            fontSize: 35,
            mathMin: 1,
            mathMax: 9,
            ignoreChars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            text: `${Math.floor(1000 + Math.random() * 9000)}`
        });
        console.log('1111111111111111111111111111111111111111111111')
        var salt_ky = genSaltKey(16);
        console.log('2222222222222222222222222222222222222222222222')
        captchMdl.insrtCpatchaTxtMdl(captcha.text, salt_ky)
            .then(function (results) {
                console.log('3333333333333333333333333333333333333333333333')
                if (results && results['insertId']) {
                    console.log(results['insertId'],'4444444444444444444444444444444444444444444444')
                    var img_src = `data:image/svg+xml;base64,` + Buffer.from(captcha.data).toString('base64');
                    console.log('Image length:', img_src.length);
                    
                    const responseData = {
                        status: 200,
                        data: {
                            data: img_src,
                            cptch_id: results['insertId'],
                            salt_ky: salt_ky
                        },
                        message: 'Captcha generated successfully'
                    };
                    
                    console.log('Sending response:', JSON.stringify(responseData).substring(0, 200));
                    res.status(200).json(responseData);
                    console.log('666666666666666666666 RESPONSE SENT 666666666666666666666');
                    return;
                }
                else {
                    console.log('5555555555555555555555555555555555555555555555')
                    log.message("ERROR", cntxtDtls, 100, `Captcha insert failed - no insertId`);
                    return res.status(500).json({
                        status: 500,
                        data: null,
                        message: 'Failed to generate captcha. Please try again.'
                    });
                }
            })
            .catch(function (error) {
                // log.message("ERROR", cntxtDtls, 100, `Captcha error: ${error.message}`);
                console.error('Captcha generation error:', error);
                return res.status(500).json({
                    status: 500,
                    data: null,
                    message: 'Database error: ' + error.message
                });
            });
    } catch (error) {
        // log.message("ERROR", cntxtDtls, 100, `Captcha exception: ${error.message}`);
        console.error('Captcha exception:', error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error: ' + error.message
        });
    }
}

/**************************************************************************************
* Controller     : getSaltKeyCtrl
* Parameters     : req, res
* Description    : Get salt key for password encryption
***************************************************************************************/
exports.getSaltKeyCtrl = function (req, res) {
    var fnm = "getSaltKeyCtrl";
    var captcha = svgCaptcha.create({
        Size: 4,
        Width: 100,
        Height: 50,
        Noise: 2,
        fontSize: 35,
        Color: false
    });
    
    var salt_ky = genSaltKey(16);
    captchMdl.insrtCpatchaTxtMdl(captcha.text, salt_ky).then(function (results) {
        if (results && results['insertId']) {
            df.formatSucessRes(req, res, { 
                salt_id: results['insertId'], 
                salt_ky: salt_ky 
            }, cntxtDtls, fnm, {});
        }
        else {
            df.formatErrorRes(res, null, cntxtDtls, fnm, {});
        }
    }, function (error) {
        df.formatErrorRes(res, error, cntxtDtls, fnm, {});
    });
}

/**************************************************************************************
* Controller     : emply_snd_otpC
* Parameters     : req, res
* Description    : Send OTP for forgot password
***************************************************************************************/
exports.emply_snd_otpC = function (req, res) {
    var fnm = "emply_snd_otpC";
    log.info(`In ${fnm}`, 0, cntxtDtls);
    const cmpnt_id = 1; // Web component

    var reqBody = req.body;
    if (req.body['data']) {
        reqBody = req.body.data;
    }
    
    validator.validate_input_params(reqBody, [
        { "field": "username", "type": "username", "name": "Username", "required": true },
        { "field": "email", "type": "email", "name": "Email Address", "required": true },
        { "field": "captcha", "type": "capcha", "required": true, "name": "Capcha" },
        { "field": "captchaID", "type": "int", "name": "captchaID", "required": true }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            return df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, { 
                "error_status": n_val.status, 
                "err_message": n_val.msg 
            });
        } else {
            validateCaptch(reqBody['captcha'], reqBody['captchaID'], (cptch_err, cpthc_res) => {
                if (!cptch_err) {
                    captchMdl.deactivateValidatedCaptchaMdl(reqBody['captchaID']).then(function (cpth_vld_res) {
                        authMdl.check_usrMdl(reqBody).then(results => {
                            if (results && results.length) {
                                authMdl.getOtpCntMdl(reqBody.email, cmpnt_id)
                                    .then((otpResults) => {
                                        if (otpResults && otpResults.length) {
                                            log.info(`Otp ${otpResults[0].atmpt_ct}st attempt`);
                                            if (otpResults[0].atmpt_ct > 3) {
                                                return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                                    "error_status": std.message.TOOMANY_ATTEMPTS.code, 
                                                    "err_message": std.message.TOOMANY_ATTEMPTS.message 
                                                });
                                            } else {
                                                let data = {
                                                    otp_id: otpResults[0].otp_id,
                                                    email: reqBody.email,
                                                    json: `${JSON.stringify(reqBody)}`,
                                                    cmpnt_id: cmpnt_id,
                                                    usr_id: results[0].usr_id
                                                }
                                                authMdl.updtSendOtpMdl(data, function (error, result) {
                                                    if (error) {
                                                        df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                                                        return;
                                                    }
                                                    return df.formatSucessRes(req, res, { 
                                                        success_msg: "OTP sent", 
                                                        otpID: data.otp_id 
                                                    }, cntxtDtls, fnm, {});
                                                });
                                            }
                                        }
                                        else {
                                            log.info('**********Web Send Otp 1st attempt************');
                                            let data = {
                                                email: reqBody.email,
                                                json: `${JSON.stringify(reqBody)}`,
                                                cmpnt_id: cmpnt_id,
                                                usr_id: results[0].usr_id
                                            }
                                            authMdl.sendOtpMdl(data, function (error, result) {
                                                if (error) {
                                                    df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                                                    return;
                                                }
                                                return df.formatSucessRes(req, res, { 
                                                    success_msg: "OTP sent", 
                                                    otpID: result.insertId 
                                                }, cntxtDtls, fnm, {});
                                            });
                                        }
                                    })
                                    .catch(function (error) {
                                        df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                                    })
                            } else
                                return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                    "err_message": 'Invalid Username or email address.' 
                                });
                        }, error => {
                            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                        })

                    })
                }
                else {
                    return df.formatErrorRes(res, null, cntxtDtls, null, std.varErrorMsg('INVALID_CAPTCHA'));
                }
            });
        }
    })
}

/**************************************************************************************
* Controller     : emply_resnd_otpC
* Parameters     : req, res
* Description    : Resend OTP for forgot password
***************************************************************************************/
exports.emply_resnd_otpC = function (req, res) {
    var fnm = "emply_resnd_otpC";
    log.info(`In ${fnm}`, 0, cntxtDtls);
    var cmpnt_id = 1;
    var reqBody = req.body;
    if (req.body['data']) {
        reqBody = req.body.data;
    }
    
    validator.validate_input_params(reqBody, [
        { "field": "username", "type": "username", "name": "Username", "required": true },
        { "field": "email", "type": "email", "name": "Email Address", "required": true },
        { "field": "captcha", "type": "capcha", "required": true, "name": "Capcha" },
        { "field": "captchaID", "type": "int", "name": "captchaID", "required": true }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            return df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, { 
                "error_status": n_val.status, 
                "err_message": n_val.msg 
            });
        } else {
            authMdl.check_usrMdl(reqBody).then(results => {
                if (results && results.length) {
                    authMdl.getOtpCntMdl(reqBody.email, cmpnt_id)
                        .then((otpResults) => {
                            if (otpResults && otpResults.length) {
                                log.info(`Otp ${otpResults[0].atmpt_ct}st attempt`);
                                let otpuserdata = (!otpResults[0].jsn_tx || otpResults[0].jsn_tx == "undefined" || otpResults[0].jsn_tx == "null") ? null : JSON.parse(otpResults[0].jsn_tx);
                                if (otpResults[0].atmpt_ct > 3) {
                                    return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                        "error_status": std.message.TOOMANY_ATTEMPTS.code, 
                                        "err_message": std.message.TOOMANY_ATTEMPTS.message 
                                    });
                                } else if (otpuserdata && (otpuserdata.email != reqBody.email || otpuserdata.username != reqBody.username)) {
                                    return df.formatErrorRes(res, null, cntxtDtls, fnm, { 
                                        err_message: 'Invalid Data sent. Please try again.' 
                                    });
                                } else {
                                    let data = {
                                        otp_id: otpResults[0].otp_id,
                                        email: reqBody.email,
                                        json: `${JSON.stringify(reqBody)}`,
                                        cmpnt_id: cmpnt_id,
                                        usr_id: results[0].usr_id
                                    }
                                    authMdl.updtSendOtpMdl(data, function (error, result) {
                                        if (error) {
                                            df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                                            return;
                                        }
                                        return df.formatSucessRes(req, res, { 
                                            success_msg: "OTP sent", 
                                            otpID: data.otp_id 
                                        }, cntxtDtls, fnm, {});
                                    });
                                }
                            }
                            else {
                                log.info('**********Web Send Otp 1st attempt************');
                                let data = {
                                    email: reqBody.email,
                                    json: `${JSON.stringify(reqBody)}`,
                                    cmpnt_id: cmpnt_id,
                                    usr_id: results[0].usr_id
                                }
                                authMdl.sendOtpMdl(data, function (error, result) {
                                    if (error) {
                                        df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                                        return;
                                    }
                                    return df.formatSucessRes(req, res, { 
                                        success_msg: "OTP sent", 
                                        otpID: result.insertId 
                                    }, cntxtDtls, fnm, {});
                                });
                            }
                        })
                        .catch(function (error) {
                            df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                        })
                } else
                    return df.formatErrorRes(res, null, cntxtDtls, null, { 
                        "err_message": 'Invalid Username or email address.' 
                    });
            }, error => {
                return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
            })
        }
    })
}

/**************************************************************************************
* Controller     : emply_vldt_otpC
* Parameters     : req, res
* Description    : Validate OTP and reset password
***************************************************************************************/
exports.emply_vldt_otpC = function (req, res) {
    var fnm = "emply_vldt_otpC";
    log.info(`In ${fnm}`, 0, cntxtDtls);
    var reqBody = req.body;
    if (req.body['data']) {
        reqBody = req.body.data;
    }
    const cmpnt_id = 1;

    validator.validate_input_params(reqBody, [
        { "field": "username", "type": "username", "name": "Username", "required": true },
        { "field": "email", "type": "email", "name": "Email Address", "required": true },
        { "field": "otp", "type": "otp", "name": "OTP", "required": true },
        { "field": "otpID", "type": "int", "name": "OTPID", "required": true }
    ], function (err, n_val) {
        if (n_val.status != 1) {
            df.formatErrorRes(res, [{ "message": n_val.error_msg }], cntxtDtls, fnm, { 
                "error_status": n_val.status, 
                "err_message": n_val.msg 
            });
        } else {
            authMdl.check_usrMdl(reqBody).then(usrDtls => {
                if (usrDtls && usrDtls.length) {
                    reqBody.usr_id = usrDtls[0].usr_id;
                    authMdl.validateOtpMdl(reqBody, function (error, results) {
                        if (error) {
                            df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                            return;
                        } else if (results && results.length) {
                            let result = results[0];
                            var duration = moment.duration(moment().diff(result.u_ts || result.i_ts));
                            var minutes = duration.asMinutes();
                            
                            if (result.code != reqBody.otp) {
                                if (result.atmpt_ct > 3)
                                    return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                        "error_status": std.message.TOOMANY_ATTEMPTS.code, 
                                        "err_message": std.message.TOOMANY_ATTEMPTS.message 
                                    });
                                else {
                                    authMdl.incOtpattemptCtMdl(result.otp_id);
                                    return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                        "error_status": std.message.INVALID_OTP.code, 
                                        "err_message": std.message.INVALID_OTP.message 
                                    });
                                }
                            } else if (result.code == reqBody.otp && minutes > 30) {
                                return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                    "error_status": std.message.INVALID_OTP.code, 
                                    "err_message": std.message.INVALID_OTP.message 
                                });
                            } else if (result.code == reqBody.otp & result.atmpt_ct > 3) {
                                return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                    "error_status": std.message.TOOMANY_ATTEMPTS.code, 
                                    "err_message": std.message.TOOMANY_ATTEMPTS.message 
                                });
                            } else if (minutes <= 30) {
                                let otpuserdata = (!result.jsn_tx || result.jsn_tx == null || result.jsn_tx == "undefined" || result.jsn_tx == "null") ? reqBody : JSON.parse(result.jsn_tx);

                                if (otpuserdata.email == reqBody.email && otpuserdata.username == reqBody.username) {
                                    // Generate temporary password
                                    const alphaChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                    const numberChars = '0123456789';
                                    const specialChars = '!@#$%^_&*';
                                    const pickedChars = _.sampleSize(alphaChars, 4)
                                        .concat(_.sampleSize(numberChars, 3))
                                        .concat(_.sampleSize(specialChars, 1));
                                    const tempPassword = _.shuffle(pickedChars).join('');
                                    
                                    authMdl.usr_rst_pswrdM(tempPassword, usrDtls[0])
                                        .then(function (results) {
                                            return df.formatSucessRes(req, res, { 
                                                success_msg: 'Password reset successful. Check your email for new password.' 
                                            }, cntxtDtls, fnm, {});
                                        })
                                        .catch(function (error) {
                                            return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
                                        })
                                } else return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                    "err_message": 'Username or email address are not matched with the one you entered previously.' 
                                });
                            }
                        } else {
                            return df.formatErrorRes(res, null, cntxtDtls, null, { 
                                "error_status": std.message.INVALID_OTP.code, 
                                "err_message": std.message.INVALID_OTP.message 
                            });
                        }
                    });
                } else
                    return df.formatErrorRes(res, null, cntxtDtls, null, { 
                        "err_message": 'Invalid Username or email address.' 
                    });
            }).catch(function (error) {
                return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
            })
        }
    })
}

/**************************************************************************************
* Controller     : logoutC
* Parameters     : req, res
* Description    : Logout user
***************************************************************************************/
exports.logoutC = function (req, res) {
    var fnm = "logoutC";
    log.info(`In ${fnm}`, 0, cntxtDtls);
    sessionStore.close();
    if (req.session && req.session.usr_id) {
        authMdl.sesn_logoutM({ 
            session_id: req.sessionID, 
            usr_id: req.session.usr_id, 
            app: req.session.app 
        }).then((results) => {
            req.session.cookie.expires = new Date(Math.round(new Date().getTime() - 30000));
            return df.formatSucessRes(req, res, {}, cntxtDtls, fnm, { 
                "success_msg": std.message.LOGGED_OUT.message 
            });
        }).catch(err => {
            req.session.cookie.expires = new Date(Math.round(new Date().getTime() - 30000));
            return df.formatErrorRes(res, err, cntxtDtls, fnm, {})
        })
    } else {
        return df.formatSucessRes(req, res, {}, cntxtDtls, fnm, { 
            "success_msg": std.message.LOGGED_OUT.message 
        });
    }
}

/**************************************************************************************
* Controller     : getUsrRolesLstCtrl
* Parameters     : req, res
* Description    : Get user roles list
***************************************************************************************/
exports.getUsrRolesLstCtrl = function (req, res) {
    var fnm = "getUsrRolesLstCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var user = {
        usr_id: req.user.usr_id,
        clnt_id: req.user.clnt.clnt_id,
        tnt_id: jsonUtils.processData(req.user.clnt.tnts),
    }
    authMdl.getUsrRolesLstMdl(user)
        .then(function (result) {
            return df.formatSucessRes(req, res, result, cntxtDtls, fnm, {});
        }).catch(function (error) {
            df.formatErrorRes(res, error, cntxtDtls, fnm, {});
        });
}

// Validate captcha function
var validateCaptch = (cptch_txt, cptch_id, calbck) => {
    captchMdl.validateCaptchaMdl(cptch_txt, cptch_id).then(function (results) {
        if (results && results.length) {
            var cptchSltKey = results[0]['cptch_slt_ky']
            calbck(false, cptchSltKey);
        }
        else {
            calbck(true, "invalid captcha");
        }
    }, function (error) {
        calbck(true, "invalid captcha");
    });
}




