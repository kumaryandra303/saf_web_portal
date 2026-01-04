// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var jsonUtils = require(appRoot + '/utils/json.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');
var smsutil = require(appRoot + '/utils/sms.utils');
var emailUtils = require(appRoot + '/utils/email.utils');
var sha512 = require('js-sha512');

/*****************************************************************************
 * Function      : loginMdl
 * Description   : User login with credentials
 * Arguments     : data, sltKey
 ******************************************************************************/
exports.loginMdl = function (data, sltKey) {
    var QRY_TO_EXEC = `SELECT u.usr_id, u.fst_nm, u.lst_nm, u.usr_nm, u.eml_tx,
                       au.clnt_id, au.tnt_id, u.a_in
                       FROM usr_lst_t u
                       LEFT JOIN usr_clnt_tnt_rel_t au ON au.usr_id=u.usr_id
                       WHERE u.usr_nm = ${sqldb.MySQLConPool.escape(data.username)}
                       AND au.a_in=1 
                       AND MD5(CONCAT(MD5(pwd_tx), ${sqldb.MySQLConPool.escape(sltKey)})) = ${sqldb.MySQLConPool.escape(data.password)}
                       AND u.a_in=1 
                       ORDER BY u.usr_id DESC 
                       LIMIT 0,1;`
    console.log(QRY_TO_EXEC)
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : recordLoginHistoryMdl
 * Description   : Record user login history
 * Arguments     : data
 ******************************************************************************/
exports.recordLoginHistoryMdl = function (data) {
    console.log(data);
    var QRY_TO_EXEC = `INSERT INTO usr_lgn_hstry_dtl_t 
                       (usr_id, cmpnt_ctgry_id, ctzn_in, clnt_id, tnt_id, i_ts) 
                       VALUES (${sqldb.MySQLConPool.escape(data.usr_id)},
                               ${sqldb.MySQLConPool.escape(data.cmpnt_ctgry_id)},
                               ${sqldb.MySQLConPool.escape(data.ctzn_in)},
                               ${sqldb.MySQLConPool.escape(data.clnt_id || null)},
                               ${sqldb.MySQLConPool.escape(data.tnt_id || null)}, 
                               current_timestamp());`;
    console.log(QRY_TO_EXEC)
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getUsrClntsMdl
 * Description   : Get user clients and tenants
 * Arguments     : usrData
 ******************************************************************************/
exports.getUsrClntsMdl = function (usrData, callback) {
    var QRY_TO_EXEC = `SELECT u.usr_id, u.rle_id, u.clnt_id, u.tnt_id,
                       c.clnt_nm, c.clnt_dsply_nm, 
                       t.tnt_nm, t.tnt_dsply_nm,
                       r.rle_nm, r.admn_rle_in,
                       u.dsgns_id, d.dsgns_nm
                       FROM usr_clnt_tnt_rel_t as u
                       JOIN usr_lst_t as au ON au.usr_id=u.usr_id
                       JOIN clnt_dtl_t as c ON u.clnt_id = c.clnt_id
                       JOIN clnt_tnt_lst_t t ON u.tnt_id = t.tnt_id
                       LEFT JOIN usr_rle_lst_t r ON u.rle_id = r.rle_id
                       LEFT JOIN usr_dsgns_lst_t d ON u.dsgns_id=d.dsgns_id
                       WHERE u.usr_id = ${sqldb.MySQLConPool.escape(usrData.usr_id)} 
                       AND u.a_in <> 0;`
    console.log(QRY_TO_EXEC);

    if (callback && typeof callback == "function")
        dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
            callback(err, results);
            return;
        });
    else
        return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getUsrAsgndPrflesMdl
 * Description   : Get user assigned profiles
 * Arguments     : clnt_id, tnt_id, usr_rle_id
 ******************************************************************************/
exports.getUsrAsgndPrflesMdl = function (clnt_id, tnt_id, usr_rle_id) {
    var QRY_TO_EXEC = `SELECT apr.rle_id, apr.prfle_id, 
                       apl.prfle_nm, apl.prfle_ctgry_cd,
                       CONCAT('internal', prfle_dshbd_url_tx) as prfle_dshbd_url_tx,
                       apl.prfle_ctgry_id, apc.prfle_ctgry_nm 
                       FROM app_prfle_rle_rel_t apr
                       LEFT JOIN app_prfle_lst_t apl ON apr.prfle_id = apl.prfle_id
                       JOIN app_prfle_ctgry_lst_t apc ON apl.prfle_ctgry_id = apc.prfle_ctgry_id
                       WHERE rle_id=${sqldb.MySQLConPool.escape(usr_rle_id)} 
                       AND apr.a_in=1 
                       AND apr.clnt_id=${sqldb.MySQLConPool.escape(clnt_id)} 
                       AND apr.tnt_id=${sqldb.MySQLConPool.escape(tnt_id)}
                       ORDER BY apl.prfle_id;`;

    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : check_usrMdl
 * Description   : Check if user exists
 * Arguments     : data
 ******************************************************************************/
exports.check_usrMdl = function (data) {
    var QRY_TO_EXEC = `SELECT u.usr_id, u.usr_nm, u.eml_tx
                       FROM usr_lst_t u 
                       WHERE u.a_in = 1 
                       AND u.eml_tx = ${sqldb.MySQLConPool.escape(data.email)} 
                       AND u.usr_nm = ${sqldb.MySQLConPool.escape(data.username)};`;
    log.info(QRY_TO_EXEC)
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getOtpCntMdl
 * Description   : Get OTP count for today
 * Arguments     : email, cmpnt_id
 ******************************************************************************/
exports.getOtpCntMdl = function (email, cmpnt_id) {
    var QRY_TO_EXEC = `SELECT otp_id, atmpt_ct, jsn_tx 
                       FROM usr_otp_lst_t 
                       WHERE date(i_ts) = CURRENT_DATE() 
                       AND email_id = ${sqldb.MySQLConPool.escape(email)} 
                       AND cmpnt_id = ${sqldb.MySQLConPool.escape(cmpnt_id)};`
    log.info(QRY_TO_EXEC)
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : sendOtpMdl
 * Description   : Send OTP via email
 * Arguments     : data, callback
 ******************************************************************************/
exports.sendOtpMdl = function (data, callback) {
    var resUID;
    var otp = smsutil.TOTP();
    let emailData = {
        gmail: data.email,
        subject: `SAF - Account Password Reset`,
        text: `<h3 class="green_text">Password reset code</h3>
        Please use this code to reset the password for the SAF account.
        <br/> 
        Here is your code: <b>${otp}</b>
        <br/>
        <br/>
        <p>If this is not requested by you. Please ignore this email.</p>
        <br/>
        Thanks,
        <br/>
        The SAF Team.`
    }
    emailUtils.sendMail(emailData, (err, results) => {
        if (err) {
            console.log(err)
            callback(err);
            return;
        } else {
            var results = { "email": data.email, uuid: resUID ? resUID : 0, code: otp, i_ts: new Date() };

            var QRY_TO_EXEC = `INSERT INTO usr_otp_lst_t 
                              (email_id, code, uuid, atmpt_ct, cmpnt_id, jsn_tx, usr_id, i_ts) 
                              VALUES (${sqldb.MySQLConPool.escape(data.email)},
                                      ${sqldb.MySQLConPool.escape(results.code)},
                                      ${sqldb.MySQLConPool.escape(results.uuid)},
                                      1,
                                      ${sqldb.MySQLConPool.escape(data.cmpnt_id || null)},
                                      ${JSON.stringify(data.json)},
                                      ${sqldb.MySQLConPool.escape(data.usr_id || null)}, 
                                      current_timestamp());`;
            console.log(QRY_TO_EXEC)
            dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (error, ins_results) {
                if (error) {
                    callback(error);
                    return;
                } else {
                    ins_results['code'] = results.code;
                    callback(error, ins_results);
                    return;
                }
            })
        }
    });
}

/*****************************************************************************
 * Function      : updtSendOtpMdl
 * Description   : Update and resend OTP
 * Arguments     : data, callback
 ******************************************************************************/
exports.updtSendOtpMdl = function (data, callback) {
    var resUID;
    var otp = smsutil.TOTP();
    let emailData = {
        gmail: data.email,
        subject: `SAF - Account Password Reset`,
        text: `<h3 class="green_text">Password reset code</h3>
        Please use this code to reset the password for the SAF account.
        <br/> 
        Here is your code: <b>${otp}</b>
        <br/>
        <br/>
        <p>If this is not requested by you. Please ignore this email.</p>
        <br/>
        Thanks,
        <br/>
        The SAF Team.`
    }
    emailUtils.sendMail(emailData, (err, results) => {
        if (err) {
            callback(err);
            return;
        } else {
            var results = { "email": data.email, uuid: resUID ? resUID : 0, code: otp, i_ts: new Date() };
            var QRY_TO_EXEC = `UPDATE usr_otp_lst_t 
                              SET atmpt_ct=atmpt_ct+1, 
                                  code=${sqldb.MySQLConPool.escape(results.code)}, 
                                  u_ts=current_timestamp(), 
                                  jsn_tx = ${JSON.stringify(data.json)},
                                  usr_id=${sqldb.MySQLConPool.escape(data.usr_id || null)} 
                              WHERE otp_id = ${sqldb.MySQLConPool.escape(data.otp_id)} 
                              AND email_id = ${sqldb.MySQLConPool.escape(data.email)};`;
            dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (error, ins_results) {
                if (error) {
                    callback(error);
                    return;
                } else {
                    callback(error, ins_results);
                    return;
                }
            })
        }
    });
}

/*****************************************************************************
 * Function      : validateOtpMdl
 * Description   : Validate OTP
 * Arguments     : data, callback
 ******************************************************************************/
exports.validateOtpMdl = function (data, callback) {
    var where = ''
    if (data.usr_id) {
        where = ` AND usr_id = ${sqldb.MySQLConPool.escape(data.usr_id)}`;
    }
    var QRY_TO_EXEC = `SELECT * FROM usr_otp_lst_t 
                       WHERE email_id=${sqldb.MySQLConPool.escape(data.email)} 
                       AND otp_id=${sqldb.MySQLConPool.escape(data.otpID)} ${where}
                       ORDER BY i_ts DESC LIMIT 1;`;
    console.log(QRY_TO_EXEC)
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (error, results) {
        callback(error, results);
        return;
    })
}

/*****************************************************************************
 * Function      : incOtpattemptCtMdl
 * Description   : Increment OTP attempt count
 * Arguments     : opt_id
 ******************************************************************************/
exports.incOtpattemptCtMdl = function (opt_id) {
    var QRY_TO_EXEC = `UPDATE usr_otp_lst_t 
                       SET atmpt_ct=atmpt_ct+1
                       WHERE otp_id=${sqldb.MySQLConPool.escape(opt_id)};`;
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (error, results) {
        return;
    })
}

/*****************************************************************************
 * Function      : usr_rst_pswrdM
 * Description   : Reset user password
 * Arguments     : newpassword, user
 ******************************************************************************/
exports.usr_rst_pswrdM = function (newpassword, user) {
    var sha512_pwd = sha512(newpassword);
    var QRY_TO_EXEC = `UPDATE usr_lst_t 
                       SET pwd_tx = ${sqldb.MySQLConPool.escape(sha512_pwd)}, 
                           u_ts=current_timestamp(), 
                           updte_usr_id=${sqldb.MySQLConPool.escape(user.usr_id)} 
                       WHERE usr_id=${sqldb.MySQLConPool.escape(user.usr_id)};`
    log.info(QRY_TO_EXEC)
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : expr_prvs_sesnsM
 * Description   : Expire previous sessions
 * Arguments     : user
 ******************************************************************************/
exports.expr_prvs_sesnsM = function (user) {
    var exp = Math.round(new Date().getTime() / 1000);
    var QRY_TO_EXEC = `UPDATE user_session_dtl_t 
                       SET expires = ${sqldb.MySQLConPool.escape(exp)}
                       WHERE JSON_EXTRACT(token, '$.usr_id')= ${sqldb.MySQLConPool.escape(user.usr_id)} 
                       AND JSON_EXTRACT(token, '$.app') = ${sqldb.MySQLConPool.escape(user.app)};`;
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, user);
};

/*****************************************************************************
 * Function      : sesn_logoutM
 * Description   : Logout session
 * Arguments     : user
 ******************************************************************************/
exports.sesn_logoutM = function (user) {
    var exp = Math.round(new Date().getTime() - 3000);
    var QRY_TO_EXEC = `UPDATE user_session_dtl_t 
                       SET expires = ${sqldb.MySQLConPool.escape(exp)} 
                       WHERE JSON_EXTRACT(token, '$.usr_id')= ${sqldb.MySQLConPool.escape(user.usr_id)} 
                       AND JSON_EXTRACT(token, '$.app') = ${sqldb.MySQLConPool.escape(user.app)};`;
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, user);
};

/*****************************************************************************
 * Function      : getUsrRolesLstMdl
 * Description   : Get user roles list
 * Arguments     : user
 ******************************************************************************/
exports.getUsrRolesLstMdl = function (user) {
    var where = '';
    if (user.clnt_id) {
        where += ` AND clnt_id = ${sqldb.MySQLConPool.escape(user.clnt_id)}`;
    }
    if (user.tnt_id) {
        where += ` AND tnt_id IN (${sqldb.MySQLConPool.escape(user.tnt_id)})`;
    }
    
    var QRY_TO_EXEC = `SELECT r.*, 
                       DATE_FORMAT(r.i_ts, '%d/%m/%Y') as dt_frmt,
                       (CASE WHEN m.lst_nm IS NOT NULL THEN CONCAT(m.fst_nm, " ", m.lst_nm) ELSE m.fst_nm END) as name,
                       ROW_NUMBER() OVER (ORDER BY r.rle_id) sno,
                       SUM(CASE WHEN u.usr_id IS NOT NULL THEN 1 ELSE 0 END) as ttl_usr_cnt
                       FROM usr_rle_lst_t as r
                       LEFT JOIN usr_clnt_tnt_rel_t u ON u.rle_id = r.rle_id
                       LEFT JOIN usr_lst_t m ON m.usr_id=u.crte_usr_id 
                       WHERE r.a_in =1 ${where}
                       GROUP BY r.rle_id
                       ORDER BY r.rle_id`
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : vrfyExstngUserMdl
 * Description   : Verify if user exists
 * Arguments     : usr_nm
 ******************************************************************************/
exports.vrfyExstngUserMdl = function (usr_nm) {
    var QRY_TO_EXEC = `SELECT usr_nm, a_in FROM usr_lst_t WHERE usr_nm='${usr_nm}'`;
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

