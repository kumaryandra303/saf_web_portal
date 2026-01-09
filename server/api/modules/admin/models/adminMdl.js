// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : getMandalsListMdl
 * Description   : Get list of mandals with ULB indicator (optionally filtered by district)
 * Arguments     : dstrt_id (optional)
 ******************************************************************************/
exports.getMandalsListMdl = function (dstrt_id) {
    var whereClause = 'WHERE a_in=1';
    
    if (dstrt_id) {
        whereClause += ` AND dstrt_id=${sqldb.MySQLConPool.escape(dstrt_id)}`;
    }
    
    var QRY_TO_EXEC = `SELECT mndl_id,
                       CASE WHEN ulb_in=1 THEN CONCAT(mndl_nm,'(','ULB',')') ELSE mndl_nm END as mndl_nm,
                       mndl_cd,
                       dstrt_id
                       FROM mndl_lst_t 
                       ${whereClause}
                       ORDER BY mndl_nm;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getDistrictsListMdl
 * Description   : Get list of districts
 * Arguments     : None
 ******************************************************************************/
exports.getDistrictsListMdl = function () {
    var QRY_TO_EXEC = `SELECT dstrt_id,
                       dstrt_nm,
                       dstrt_cd 
                       FROM dstrt_lst_t 
                       WHERE a_in=1
                       ORDER BY dstrt_nm;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

