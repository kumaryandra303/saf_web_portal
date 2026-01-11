// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : getDashboardStatsMdl
 * Description   : Get dashboard statistics (members count, donations, funds, etc.)
 ******************************************************************************/
exports.getDashboardStatsMdl = function () {
    var QRY_TO_EXEC = `SELECT 
        (SELECT COUNT(*) FROM saf_mmbr_lst_t WHERE a_in=1) as total_members,
        (SELECT COUNT(*) FROM saf_mmbr_lst_t WHERE a_in=1 AND pymnt_stts='paid') as paid_members,
        (SELECT COALESCE(SUM(fund_amnt), 0) FROM saf_fund_lst_t WHERE pymnt_stts='completed' AND a_in=1) as donation_amount,
        (SELECT COUNT(DISTINCT dntr_nm) FROM saf_fund_lst_t WHERE pymnt_stts='completed' AND a_in=1) as donors_count,
        (SELECT COUNT(*) FROM saf_updates_t WHERE a_in=1) as total_updates,
        (SELECT 
            COALESCE((SELECT SUM(fund_amnt) FROM saf_fund_lst_t WHERE pymnt_stts='completed' AND a_in=1), 0) + 
            COALESCE((SELECT SUM(pymnt_amnt) FROM saf_pymnt_trnsctn_t WHERE pymnt_stts='success' AND a_in=1), 0)
        ) as saf_funds,
        (SELECT COUNT(*) FROM saf_updates_t WHERE a_in=1 AND updt_typ_cd='program') as total_programs,
        (SELECT COALESCE(SUM(pymnt_amnt), 0) FROM saf_pymnt_trnsctn_t WHERE pymnt_stts='success' AND a_in=1) as sabyatwam_amount;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getTopMembersMdl
 * Description   : Get top 3 main members (by registration date or other criteria)
 ******************************************************************************/
exports.getTopMembersMdl = function () {
    var QRY_TO_EXEC = `SELECT 
        s.saf_mmbr_id,
        s.fll_nm,
        s.fthr_nm,
        DATE_FORMAT(s.dob_dt, '%d-%m-%Y') as dob_dt,
        s.gndr_cd,
        s.phne_no,
        s.eml_tx,
        d.dstrt_nm,
        m.mndl_nm,
        s.pymnt_stts,
        DATE_FORMAT(s.i_ts, '%d-%m-%Y') as reg_dt,
        COALESCE(p.pymnt_amnt, 0) as donation_amnt
        FROM saf_mmbr_lst_t s
        LEFT JOIN dstrt_lst_t d ON s.dstrt_id = d.dstrt_id
        LEFT JOIN mndl_lst_t m ON s.mndl_id = m.mndl_id
        LEFT JOIN saf_pymnt_trnsctn_t p ON s.pymnt_trnsctn_id = p.pymnt_trnsctn_id AND p.pymnt_stts='success'
        WHERE s.a_in=1
        ORDER BY s.i_ts DESC
        LIMIT 3;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getDistrictWiseStatsMdl
 * Description   : Get district-wise statistics (members, donations, etc.)
 ******************************************************************************/
exports.getDistrictWiseStatsMdl = function () {
    var QRY_TO_EXEC = `SELECT 
        d.dstrt_id,
        d.dstrt_nm,
        COUNT(DISTINCT s.saf_mmbr_id) as total_members,
        COUNT(DISTINCT CASE WHEN s.pymnt_stts='paid' THEN s.saf_mmbr_id END) as paid_members,
        COUNT(DISTINCT CASE WHEN p.pymnt_stts='success' AND p.a_in=1 THEN s.saf_mmbr_id END) as donors_count,
        COALESCE(SUM(CASE WHEN p.pymnt_stts='success' AND p.a_in=1 THEN p.pymnt_amnt ELSE 0 END), 0) as total_donations,
        COALESCE(
            SUM(CASE WHEN p.pymnt_stts='success' AND p.a_in=1 THEN p.pymnt_amnt ELSE 0 END) / 
            NULLIF(COUNT(DISTINCT CASE WHEN p.pymnt_stts='success' AND p.a_in=1 THEN s.saf_mmbr_id END), 0), 
            0
        ) as avg_donation
        FROM dstrt_lst_t d
        LEFT JOIN saf_mmbr_lst_t s ON d.dstrt_id = s.dstrt_id AND s.a_in=1
        LEFT JOIN saf_pymnt_trnsctn_t p ON s.pymnt_trnsctn_id = p.pymnt_trnsctn_id AND p.a_in=1
        WHERE d.a_in=1
        GROUP BY d.dstrt_id, d.dstrt_nm
        HAVING total_members > 0
        ORDER BY total_donations DESC, total_members DESC;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

