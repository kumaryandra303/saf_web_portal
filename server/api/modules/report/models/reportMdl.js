// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : getReportsMdl
 * Description   : Get reports with filters (district, mandal, date range, payment method)
 * Arguments     : filters (district_id, mandal_id, date_from, date_to, payment_method)
 ******************************************************************************/
exports.getReportsMdl = function (filters) {
    var whereClause = 'WHERE s.a_in=1 AND p.pymnt_stts IS NOT NULL';
    
    // District filter
    if (filters.district_id) {
        whereClause += ` AND s.dstrt_id=${sqldb.MySQLConPool.escape(filters.district_id)}`;
    }
    
    // Mandal filter
    if (filters.mandal_id) {
        whereClause += ` AND s.mndl_id=${sqldb.MySQLConPool.escape(filters.mandal_id)}`;
    }
    
    // Date range filter
    if (filters.date_from) {
        whereClause += ` AND DATE(p.pymnt_dt) >= ${sqldb.MySQLConPool.escape(filters.date_from)}`;
    }
    
    if (filters.date_to) {
        whereClause += ` AND DATE(p.pymnt_dt) <= ${sqldb.MySQLConPool.escape(filters.date_to)}`;
    }
    
    // Payment method filter
    if (filters.payment_method) {
        whereClause += ` AND p.pymnt_mthd=${sqldb.MySQLConPool.escape(filters.payment_method)}`;
    }
    
    var QRY_TO_EXEC = `SELECT 
                       s.saf_mmbr_id,
                       s.fll_nm as member_name,
                       s.phne_no as phone,
                       s.eml_tx as email,
                       s.dstrt_id,
                       d.dstrt_nm as district_name,
                       s.mndl_id,
                       CASE WHEN m.ulb_in=1 THEN CONCAT(m.mndl_nm,'(','ULB',')') ELSE m.mndl_nm END as mandal_name,
                       p.pymnt_trnsctn_id,
                       p.pymnt_amnt as payment_amount,
                       p.pymnt_mthd as payment_method,
                       p.pymnt_stts as payment_status,
                       DATE_FORMAT(p.pymnt_dt, '%Y-%m-%d') as payment_date,
                       DATE_FORMAT(p.pymnt_dt, '%d-%m-%Y %H:%i:%s') as payment_date_formatted,
                       DATE_FORMAT(s.i_ts, '%d-%m-%Y %H:%i:%s') as registration_date,
                       p.rzrpy_ordr_id as razorpay_order_id,
                       p.rzrpy_pymnt_id as razorpay_payment_id
                       FROM saf_mmbr_lst_t s
                       INNER JOIN saf_pymnt_trnsctn_t p ON s.pymnt_trnsctn_id = p.pymnt_trnsctn_id
                       LEFT JOIN dstrt_lst_t d ON s.dstrt_id = d.dstrt_id
                       LEFT JOIN mndl_lst_t m ON s.mndl_id = m.mndl_id
                       ${whereClause}
                       ORDER BY p.pymnt_dt DESC, s.i_ts DESC;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



