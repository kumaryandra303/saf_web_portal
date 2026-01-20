// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var sqldb = require(appRoot + '/config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require(appRoot + '/utils/db.utils');

/*****************************************************************************
 * Function      : insertPaymentTransactionMdl
 * Description   : Insert payment transaction record
 * Arguments     : transactionData
 ******************************************************************************/
exports.insertPaymentTransactionMdl = function (transactionData) {
    var QRY_TO_EXEC = `INSERT INTO saf_pymnt_trnsctn_t 
                       (rzrpy_ordr_id, pymnt_amnt, pymnt_crrncy, pymnt_stts, i_ts) 
                       VALUES (
                        ${sqldb.MySQLConPool.escape(transactionData.razorpay_order_id)},
                        ${sqldb.MySQLConPool.escape(transactionData.amount)},
                        ${sqldb.MySQLConPool.escape(transactionData.currency || 'INR')},
                        'pending',
                        current_timestamp()
                       );`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : updatePaymentTransactionMdl
 * Description   : Update payment transaction with payment details
 * Arguments     : transactionData
 ******************************************************************************/
exports.updatePaymentTransactionMdl = function (transactionData) {
    var QRY_TO_EXEC = `UPDATE saf_pymnt_trnsctn_t 
                       SET rzrpy_pymnt_id=${sqldb.MySQLConPool.escape(transactionData.razorpay_payment_id)},
                           rzrpy_sgntr=${sqldb.MySQLConPool.escape(transactionData.razorpay_signature)},
                           pymnt_stts=${sqldb.MySQLConPool.escape(transactionData.status)},
                           pymnt_mthd=${sqldb.MySQLConPool.escape(transactionData.method || null)},
                           pymnt_dt=current_timestamp(),
                           rspns_jsn=${sqldb.MySQLConPool.escape(JSON.stringify(transactionData.response || {}))},
                           u_ts=current_timestamp()
                       WHERE rzrpy_ordr_id=${sqldb.MySQLConPool.escape(transactionData.razorpay_order_id)};`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : getPaymentByOrderIdMdl
 * Description   : Get payment transaction by Razorpay order ID
 * Arguments     : razorpay_order_id
 ******************************************************************************/
exports.getPaymentByOrderIdMdl = function (razorpay_order_id) {
    var QRY_TO_EXEC = `SELECT * FROM saf_pymnt_trnsctn_t 
                       WHERE rzrpy_ordr_id=${sqldb.MySQLConPool.escape(razorpay_order_id)};`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : linkPaymentToMemberMdl
 * Description   : Link payment transaction to member record
 * Arguments     : member_id, payment_transaction_id
 ******************************************************************************/
exports.linkPaymentToMemberMdl = function (member_id, payment_transaction_id) {
    var QRY_TO_EXEC = `UPDATE saf_mmbr_lst_t 
                       SET pymnt_trnsctn_id=${sqldb.MySQLConPool.escape(payment_transaction_id)},
                           pymnt_stts='paid',
                           mmbr_stts='active',
                           u_ts=current_timestamp()
                       WHERE saf_mmbr_id=${sqldb.MySQLConPool.escape(member_id)};`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

/*****************************************************************************
 * Function      : updateMemberPaymentTransactionMdl
 * Description   : Update payment_transaction_id in member record
 * Arguments     : member_id, payment_transaction_id
 ******************************************************************************/
exports.updateMemberPaymentTransactionMdl = function (member_id, payment_transaction_id) {
    var QRY_TO_EXEC = `UPDATE saf_pymnt_trnsctn_t 
                       SET saf_mmbr_id=${sqldb.MySQLConPool.escape(member_id)},
                           u_ts=current_timestamp()
                       WHERE pymnt_trnsctn_id=${sqldb.MySQLConPool.escape(payment_transaction_id)};`;
    
    console.log(QRY_TO_EXEC);
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};









