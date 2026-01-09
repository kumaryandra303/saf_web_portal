var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
* Function      : insrtCpatchaTxtMdl
* Description   : Insert captcha text into database
* Arguments     : callback function
******************************************************************************/
exports.insrtCpatchaTxtMdl = function (cptch_txt, salt_ky) {
    var QRY_TO_EXEC = ` INSERT INTO usr_cptch_lst_t(cptch_txt, cptch_slt_ky, i_ts)
                        VALUES(${sqldb.MySQLConPool.escape(cptch_txt)}, 
                               ${sqldb.MySQLConPool.escape(salt_ky)}, 
                               CURRENT_TIMESTAMP());`;
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
* Function      : validateCaptchaMdl
* Description   : Validate captcha
* Arguments     : callback function
******************************************************************************/
exports.validateCaptchaMdl = function (cptch_txt, cptch_id) {
    var QRY_TO_EXEC = ` SELECT * FROM usr_cptch_lst_t 
                        WHERE cptch_id = ${sqldb.MySQLConPool.escape(cptch_id)} 
                        AND SHA1(cptch_txt) = SHA1(${sqldb.MySQLConPool.escape(cptch_txt)}) 
                        AND a_in=1 `;
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
* Function      : getSaltKeyMdl
* Description   : Get salt key
* Arguments     : callback function
******************************************************************************/
exports.getSaltKeyMdl = function (cptch_id) {
    var QRY_TO_EXEC = ` SELECT cptch_slt_ky FROM usr_cptch_lst_t 
                        WHERE cptch_id = ${sqldb.MySQLConPool.escape(cptch_id)} 
                        AND a_in=1 `;
    console.log(QRY_TO_EXEC)
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
* Function      : captchScheduleJobMdl
* Description   : Clean old captcha records
* Arguments     : callback function
******************************************************************************/
exports.captchScheduleJobMdl = function (cptch_txt, cptch_id) {
    var QRY_TO_EXEC = ` DELETE FROM usr_cptch_lst_t 
                        WHERE i_ts < CURRENT_TIMESTAMP() - INTERVAL 1 HOUR; `;
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
* Function      : deactivateValidatedCaptchaMdl
* Description   : Deactivate validated captcha
* Arguments     : callback function
******************************************************************************/
exports.deactivateValidatedCaptchaMdl = function (cptch_id) {
    var QRY_TO_EXEC = ` UPDATE usr_cptch_lst_t 
                        SET a_in=0, u_ts=CURRENT_TIMESTAMP()
                        WHERE cptch_id=${sqldb.MySQLConPool.escape(cptch_id)} `;
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};







