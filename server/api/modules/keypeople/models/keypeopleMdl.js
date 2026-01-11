// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : getKeyPeopleMdl
 * Description   : Get all active key people ordered by sort order
 ******************************************************************************/
exports.getKeyPeopleMdl = function () {
    var QRY_TO_EXEC = `SELECT 
        saf_key_prsn_id,
        fll_nm,
        dsgns_nm,
        rspnsblty_tx,
        img_pth,
        phne_no,
        eml_tx,
        srt_ordr,
        DATE_FORMAT(i_ts, '%d-%m-%Y %H:%i:%s') as crte_dt
        FROM saf_key_people_t
        WHERE a_in=1
        ORDER BY srt_ordr ASC, i_ts DESC
        LIMIT 10;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getTopKeyPeopleMdl
 * Description   : Get top 3 key people for dashboard
 ******************************************************************************/
exports.getTopKeyPeopleMdl = function () {
    var QRY_TO_EXEC = `SELECT 
        saf_key_prsn_id,
        fll_nm,
        dsgns_nm,
        rspnsblty_tx,
        img_pth,
        phne_no,
        eml_tx,
        srt_ordr
        FROM saf_key_people_t
        WHERE a_in=1
        ORDER BY srt_ordr ASC, i_ts DESC
        LIMIT 3;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

