// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : checkAadharExistsMdl
 * Description   : Check if Aadhar number already exists
 * Arguments     : aadhar_no
 ******************************************************************************/
exports.checkAadharExistsMdl = function (aadhar_no) {
    var QRY_TO_EXEC = `SELECT saf_mmbr_id, fll_nm, phne_no 
                       FROM saf_mmbr_lst_t 
                       WHERE adhr_no=${sqldb.MySQLConPool.escape(aadhar_no)} 
                       AND a_in=1;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : insertMembershipMdl
 * Description   : Insert new SAF membership record
 * Arguments     : memberData
 ******************************************************************************/
exports.insertMembershipMdl = function (memberData) {
    var QRY_TO_EXEC = `INSERT INTO saf_mmbr_lst_t 
                       (fll_nm, fthr_nm, dob_dt, gndr_cd, phne_no, eml_tx, 
                        adrs_tx, dstrt_id, mndl_id, pncd_no, adhr_no, 
                        occptn_tx, edctn_tx, a_in, i_ts) 
                       VALUES (
                        ${sqldb.MySQLConPool.escape(memberData.full_name)},
                        ${sqldb.MySQLConPool.escape(memberData.father_name)},
                        ${sqldb.MySQLConPool.escape(memberData.dob)},
                        ${sqldb.MySQLConPool.escape(memberData.gender)},
                        ${sqldb.MySQLConPool.escape(memberData.phone)},
                        ${sqldb.MySQLConPool.escape(memberData.email || null)},
                        ${sqldb.MySQLConPool.escape(memberData.address)},
                        ${sqldb.MySQLConPool.escape(memberData.district_id)},
                        ${sqldb.MySQLConPool.escape(memberData.mandal_id)},
                        ${sqldb.MySQLConPool.escape(memberData.pincode)},
                        ${sqldb.MySQLConPool.escape(memberData.aadhar_no)},
                        ${sqldb.MySQLConPool.escape(memberData.occupation || null)},
                        ${sqldb.MySQLConPool.escape(memberData.education || null)},
                        1,
                        current_timestamp()
                       );`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getMembersListMdl
 * Description   : Get SAF members list with optional district and mandal filters
 * Arguments     : filters (district_id, mandal_id)
 ******************************************************************************/
exports.getMembersListMdl = function (filters) {
    var whereClause = 'WHERE s.a_in=1';
    
    if (filters.district_id) {
        whereClause += ` AND s.dstrt_id=${sqldb.MySQLConPool.escape(filters.district_id)}`;
    }
    
    if (filters.mandal_id) {
        whereClause += ` AND s.mndl_id=${sqldb.MySQLConPool.escape(filters.mandal_id)}`;
    }
    
    var QRY_TO_EXEC = `SELECT 
                       s.saf_mmbr_id,
                       s.fll_nm,
                       s.fthr_nm,
                       DATE_FORMAT(s.dob_dt, '%d-%m-%Y') as dob_dt,
                       s.gndr_cd,
                       s.phne_no,
                       s.eml_tx,
                       s.adrs_tx,
                       s.dstrt_id,
                       d.dstrt_nm,
                       s.mndl_id,
                       CASE WHEN m.ulb_in=1 THEN CONCAT(m.mndl_nm,'(','ULB',')') ELSE m.mndl_nm END as mndl_nm,
                       s.pncd_no,
                       s.occptn_tx,
                       s.edctn_tx,
                       DATE_FORMAT(s.i_ts, '%d-%m-%Y %H:%i:%s') as reg_dt,
                       ROW_NUMBER() OVER (ORDER BY s.i_ts DESC) as sno
                       FROM saf_mmbr_lst_t s
                       LEFT JOIN dstrt_lst_t d ON s.dstrt_id = d.dstrt_id
                       LEFT JOIN mndl_lst_t m ON s.mndl_id = m.mndl_id
                       ${whereClause}
                       ORDER BY s.i_ts DESC;`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

