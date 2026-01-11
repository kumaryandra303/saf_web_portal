// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : getUpdatesListMdl
 * Description   : Get list of updates with optional year and month filters
 * Arguments     : filters (year, month)
 ******************************************************************************/
exports.getUpdatesListMdl = function (filters) {
    var whereClause = 'WHERE a_in=1';
    
    if (filters.year) {
        whereClause += ` AND YEAR(updt_dt)=${sqldb.MySQLConPool.escape(filters.year)}`;
    }
    
    if (filters.month) {
        whereClause += ` AND MONTH(updt_dt)=${sqldb.MySQLConPool.escape(filters.month)}`;
    }
    
    var QRY_TO_EXEC = `SELECT 
                       saf_updt_id,
                       updt_ttl_en,
                       updt_ttl_te,
                       updt_cntnt_en,
                       updt_cntnt_te,
                       updt_typ_cd,
                       DATE_FORMAT(updt_dt, '%Y-%m-%d') as updt_dt,
                       YEAR(updt_dt) as updt_yr,
                       MONTH(updt_dt) as updt_mnth,
                       img_1_pth,
                       img_2_pth,
                       img_3_pth,
                       DATE_FORMAT(i_ts, '%d-%m-%Y %H:%i:%s') as crte_dt,
                       ROW_NUMBER() OVER (ORDER BY updt_dt DESC, i_ts DESC) as sno
                       FROM saf_updates_t
                       ${whereClause}
                       ORDER BY updt_dt DESC, i_ts DESC;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getUpdateByIdMdl
 * Description   : Get single update by ID
 * Arguments     : update_id
 ******************************************************************************/
exports.getUpdateByIdMdl = function (update_id) {
    var QRY_TO_EXEC = `SELECT 
                       saf_updt_id,
                       updt_ttl_en,
                       updt_ttl_te,
                       updt_cntnt_en,
                       updt_cntnt_te,
                       updt_typ_cd,
                       DATE_FORMAT(updt_dt, '%Y-%m-%d') as updt_dt,
                       YEAR(updt_dt) as updt_yr,
                       MONTH(updt_dt) as updt_mnth,
                       img_1_pth,
                       img_2_pth,
                       img_3_pth,
                       DATE_FORMAT(i_ts, '%d-%m-%Y %H:%i:%s') as crte_dt,
                       DATE_FORMAT(u_ts, '%d-%m-%Y %H:%i:%s') as updte_dt
                       FROM saf_updates_t
                       WHERE saf_updt_id=${sqldb.MySQLConPool.escape(update_id)}
                       AND a_in=1;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : insertUpdateMdl
 * Description   : Insert new update
 * Arguments     : updateData
 ******************************************************************************/
exports.insertUpdateMdl = function (updateData) {
    var QRY_TO_EXEC = `INSERT INTO saf_updates_t 
                       (updt_ttl_en, updt_ttl_te, updt_cntnt_en, updt_cntnt_te, 
                        updt_typ_cd, updt_dt, img_1_pth, img_2_pth, img_3_pth, 
                        crte_usr_id, i_ts) 
                       VALUES (
                        ${sqldb.MySQLConPool.escape(updateData.updt_ttl_en)},
                        ${sqldb.MySQLConPool.escape(updateData.updt_ttl_te)},
                        ${sqldb.MySQLConPool.escape(updateData.updt_cntnt_en)},
                        ${sqldb.MySQLConPool.escape(updateData.updt_cntnt_te)},
                        ${sqldb.MySQLConPool.escape(updateData.updt_typ_cd)},
                        ${sqldb.MySQLConPool.escape(updateData.updt_dt)},
                        ${sqldb.MySQLConPool.escape(updateData.img_1_pth || null)},
                        ${sqldb.MySQLConPool.escape(updateData.img_2_pth || null)},
                        ${sqldb.MySQLConPool.escape(updateData.img_3_pth || null)},
                        ${sqldb.MySQLConPool.escape(updateData.crte_usr_id || null)},
                        current_timestamp()
                       );`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : updateUpdateMdl
 * Description   : Update existing update
 * Arguments     : update_id, updateData
 ******************************************************************************/
exports.updateUpdateMdl = function (update_id, updateData) {
    var QRY_TO_EXEC = `UPDATE saf_updates_t 
                       SET updt_ttl_en=${sqldb.MySQLConPool.escape(updateData.updt_ttl_en)},
                           updt_ttl_te=${sqldb.MySQLConPool.escape(updateData.updt_ttl_te)},
                           updt_cntnt_en=${sqldb.MySQLConPool.escape(updateData.updt_cntnt_en)},
                           updt_cntnt_te=${sqldb.MySQLConPool.escape(updateData.updt_cntnt_te)},
                           updt_typ_cd=${sqldb.MySQLConPool.escape(updateData.updt_typ_cd)},
                           updt_dt=${sqldb.MySQLConPool.escape(updateData.updt_dt)},
                           img_1_pth=${sqldb.MySQLConPool.escape(updateData.img_1_pth || null)},
                           img_2_pth=${sqldb.MySQLConPool.escape(updateData.img_2_pth || null)},
                           img_3_pth=${sqldb.MySQLConPool.escape(updateData.img_3_pth || null)},
                           updte_usr_id=${sqldb.MySQLConPool.escape(updateData.updte_usr_id || null)},
                           u_ts=current_timestamp()
                       WHERE saf_updt_id=${sqldb.MySQLConPool.escape(update_id)}
                       AND a_in=1;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : deleteUpdateMdl
 * Description   : Soft delete update (set a_in=0)
 * Arguments     : update_id
 ******************************************************************************/
exports.deleteUpdateMdl = function (update_id) {
    var QRY_TO_EXEC = `UPDATE saf_updates_t 
                       SET a_in=0,
                           u_ts=current_timestamp()
                       WHERE saf_updt_id=${sqldb.MySQLConPool.escape(update_id)};`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getAvailableYearsMdl
 * Description   : Get distinct years from updates for filter
 * Arguments     : None
 ******************************************************************************/
exports.getAvailableYearsMdl = function () {
    var QRY_TO_EXEC = `SELECT DISTINCT YEAR(updt_dt) as year 
                       FROM saf_updates_t 
                       WHERE a_in=1 
                       ORDER BY year DESC;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



