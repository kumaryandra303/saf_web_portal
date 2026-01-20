// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : getFundsListMdl
 * Description   : Get list of funds with optional filters
 * Arguments     : filters (payment_method, payment_status, district_id, date_from, date_to)
 ******************************************************************************/
exports.getFundsListMdl = function (filters) {
    var whereClause = 'WHERE f.a_in=1';
    
    if (filters.payment_method) {
        whereClause += ` AND f.pymnt_mthd=${sqldb.MySQLConPool.escape(filters.payment_method)}`;
    }
    
    if (filters.payment_status) {
        whereClause += ` AND f.pymnt_stts=${sqldb.MySQLConPool.escape(filters.payment_status)}`;
    }
    
    if (filters.district_id) {
        whereClause += ` AND f.dstrt_id=${sqldb.MySQLConPool.escape(filters.district_id)}`;
    }
    
    if (filters.date_from) {
        whereClause += ` AND DATE(f.pymnt_dt) >= ${sqldb.MySQLConPool.escape(filters.date_from)}`;
    }
    
    if (filters.date_to) {
        whereClause += ` AND DATE(f.pymnt_dt) <= ${sqldb.MySQLConPool.escape(filters.date_to)}`;
    }
    
    var QRY_TO_EXEC = `SELECT 
        f.saf_fund_id,
        f.dntr_nm,
        f.dntr_phne_no,
        f.dntr_eml_tx,
        f.fund_amnt,
        f.pymnt_mthd,
        f.upi_id,
        f.trnsctn_id,
        f.bnk_nm,
        f.chq_no,
        f.pymnt_stts,
        f.dstrt_id,
        d.dstrt_nm,
        f.mndl_id,
        m.mndl_nm,
        f.fund_dscrptn_tx,
        f.rcpt_img_pth,
        DATE_FORMAT(f.pymnt_dt, '%d-%m-%Y %H:%i:%s') as pymnt_dt,
        DATE_FORMAT(f.i_ts, '%d-%m-%Y %H:%i:%s') as crte_dt,
        ROW_NUMBER() OVER (ORDER BY f.pymnt_dt DESC, f.i_ts DESC) as sno
        FROM saf_fund_lst_t f
        LEFT JOIN dstrt_lst_t d ON f.dstrt_id = d.dstrt_id
        LEFT JOIN mndl_lst_t m ON f.mndl_id = m.mndl_id
        ${whereClause}
        ORDER BY f.pymnt_dt DESC, f.i_ts DESC;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getFundByIdMdl
 * Description   : Get single fund by ID
 * Arguments     : fund_id
 ******************************************************************************/
exports.getFundByIdMdl = function (fund_id) {
    var QRY_TO_EXEC = `SELECT 
        f.saf_fund_id,
        f.dntr_nm,
        f.dntr_phne_no,
        f.dntr_eml_tx,
        f.fund_amnt,
        f.pymnt_mthd,
        f.upi_id,
        f.trnsctn_id,
        f.bnk_nm,
        f.chq_no,
        f.pymnt_stts,
        f.dstrt_id,
        d.dstrt_nm,
        f.mndl_id,
        m.mndl_nm,
        f.fund_dscrptn_tx,
        f.rcpt_img_pth,
        DATE_FORMAT(f.pymnt_dt, '%Y-%m-%d') as pymnt_dt,
        DATE_FORMAT(f.i_ts, '%d-%m-%Y %H:%i:%s') as crte_dt
        FROM saf_fund_lst_t f
        LEFT JOIN dstrt_lst_t d ON f.dstrt_id = d.dstrt_id
        LEFT JOIN mndl_lst_t m ON f.mndl_id = m.mndl_id
        WHERE f.saf_fund_id=${sqldb.MySQLConPool.escape(fund_id)} AND f.a_in=1;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : insertFundMdl
 * Description   : Insert new fund record
 * Arguments     : fundData
 ******************************************************************************/
exports.insertFundMdl = function (fundData) {
    var QRY_TO_EXEC = `INSERT INTO saf_fund_lst_t 
        (dntr_nm, dntr_phne_no, dntr_eml_tx, fund_amnt, pymnt_mthd, 
         upi_id, trnsctn_id, bnk_nm, chq_no, pymnt_stts, 
         dstrt_id, mndl_id, fund_dscrptn_tx, rcpt_img_pth, pymnt_dt, a_in, i_ts) 
        VALUES (
            ${sqldb.MySQLConPool.escape(fundData.donor_name)},
            ${sqldb.MySQLConPool.escape(fundData.donor_phone || null)},
            ${sqldb.MySQLConPool.escape(fundData.donor_email || null)},
            ${sqldb.MySQLConPool.escape(fundData.fund_amount)},
            ${sqldb.MySQLConPool.escape(fundData.payment_method)},
            ${sqldb.MySQLConPool.escape(fundData.upi_id || null)},
            ${sqldb.MySQLConPool.escape(fundData.transaction_id || null)},
            ${sqldb.MySQLConPool.escape(fundData.bank_name || null)},
            ${sqldb.MySQLConPool.escape(fundData.cheque_no || null)},
            ${sqldb.MySQLConPool.escape(fundData.payment_status || 'completed')},
            ${sqldb.MySQLConPool.escape(fundData.district_id || null)},
            ${sqldb.MySQLConPool.escape(fundData.mandal_id || null)},
            ${sqldb.MySQLConPool.escape(fundData.description || null)},
            ${sqldb.MySQLConPool.escape(fundData.receipt_image_path || null)},
            ${fundData.payment_date ? sqldb.MySQLConPool.escape(fundData.payment_date) : 'current_timestamp()'},
            1,
            current_timestamp()
        );`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : updateFundMdl
 * Description   : Update fund record
 * Arguments     : fund_id, fundData
 ******************************************************************************/
exports.updateFundMdl = function (fund_id, fundData) {
    var QRY_TO_EXEC = `UPDATE saf_fund_lst_t SET
        dntr_nm=${sqldb.MySQLConPool.escape(fundData.donor_name)},
        dntr_phne_no=${sqldb.MySQLConPool.escape(fundData.donor_phone || null)},
        dntr_eml_tx=${sqldb.MySQLConPool.escape(fundData.donor_email || null)},
        fund_amnt=${sqldb.MySQLConPool.escape(fundData.fund_amount)},
        pymnt_mthd=${sqldb.MySQLConPool.escape(fundData.payment_method)},
        upi_id=${sqldb.MySQLConPool.escape(fundData.upi_id || null)},
        trnsctn_id=${sqldb.MySQLConPool.escape(fundData.transaction_id || null)},
        bnk_nm=${sqldb.MySQLConPool.escape(fundData.bank_name || null)},
        chq_no=${sqldb.MySQLConPool.escape(fundData.cheque_no || null)},
        pymnt_stts=${sqldb.MySQLConPool.escape(fundData.payment_status || 'completed')},
        dstrt_id=${sqldb.MySQLConPool.escape(fundData.district_id || null)},
        mndl_id=${sqldb.MySQLConPool.escape(fundData.mandal_id || null)},
        fund_dscrptn_tx=${sqldb.MySQLConPool.escape(fundData.description || null)},
        rcpt_img_pth=${sqldb.MySQLConPool.escape(fundData.receipt_image_path || null)},
        pymnt_dt=${fundData.payment_date ? sqldb.MySQLConPool.escape(fundData.payment_date) : 'pymnt_dt'},
        u_ts=current_timestamp()
        WHERE saf_fund_id=${sqldb.MySQLConPool.escape(fund_id)} AND a_in=1;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : deleteFundMdl
 * Description   : Soft delete fund record
 * Arguments     : fund_id
 ******************************************************************************/
exports.deleteFundMdl = function (fund_id) {
    var QRY_TO_EXEC = `UPDATE saf_fund_lst_t 
        SET a_in=0, u_ts=current_timestamp()
        WHERE saf_fund_id=${sqldb.MySQLConPool.escape(fund_id)};`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getTotalFundsMdl
 * Description   : Get total funds amount
 ******************************************************************************/
exports.getTotalFundsMdl = function () {
    var QRY_TO_EXEC = `SELECT 
        COALESCE(SUM(fund_amnt), 0) as total_funds,
        COUNT(*) as total_donations,
        COUNT(DISTINCT dntr_nm) as total_donors
        FROM saf_fund_lst_t
        WHERE a_in=1 AND pymnt_stts='completed';`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};






