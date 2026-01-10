// Standard Inclusions
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var df = require(appRoot + '/utils/dflower.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var crypto = require('crypto');

// Razorpay SDK
var Razorpay = require('razorpay');

// Model Inclusions
var paymentMdl = require('../models/paymentMdl');
var safMdl = require('../../saf/models/safMdl');

// Razorpay Configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Validate Razorpay credentials
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET || 
    RAZORPAY_KEY_ID === 'your_razorpay_key_id' || 
    RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret') {
    console.error('⚠️  RAZORPAY CREDENTIALS NOT CONFIGURED!');
    console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file');
    console.error('Get your keys from: https://dashboard.razorpay.com/app/keys');
}

const razorpayInstance = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET ? new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
}) : null;

/**************************************************************************************
* Controller     : createOrderCtrl
* Parameters     : req, res
* Description    : Create Razorpay order for SAF membership payment
***************************************************************************************/
exports.createOrderCtrl = function (req, res) {
    var fnm = "createOrderCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    // Check if Razorpay is configured
    if (!razorpayInstance) {
        console.error('Razorpay not configured!');
        return df.formatErrorRes(res, null, cntxtDtls, fnm, {
            "error_status": 500,
            "err_message": "Payment gateway not configured. Please contact administrator."
        });
    }

    const MEMBERSHIP_FEE = 20; // ₹20 membership fee

    try {
        const options = {
            amount: MEMBERSHIP_FEE * 100, // Amount in paise (20 * 100 = 2000 paise)
            currency: 'INR',
            receipt: `saf_member_${Date.now()}`,
            payment_capture: 1 // Auto capture payment
        };

        razorpayInstance.orders.create(options, function (err, order) {
            if (err) {
                console.error('Razorpay Order Creation Error:', err);
                console.error('Error details:', JSON.stringify(err, null, 2));
                return df.formatErrorRes(res, err, cntxtDtls, fnm, {
                    "err_message": "Failed to create payment order. Please check Razorpay credentials."
                });
            }

            // Insert payment transaction record
            paymentMdl.insertPaymentTransactionMdl({
                razorpay_order_id: order.id,
                amount: MEMBERSHIP_FEE,
                currency: 'INR'
            })
            .then(function (insertResult) {
                return df.formatSucessRes(req, res, {
                    order_id: order.id,
                    amount: MEMBERSHIP_FEE,
                    currency: 'INR',
                    key_id: RAZORPAY_KEY_ID
                }, cntxtDtls, fnm, {});
            })
            .catch(function (error) {
                console.error('Database Error:', error);
                return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
            });
        });
    } catch (error) {
        console.error('Order Creation Exception:', error);
        return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
    }
};

/**************************************************************************************
* Controller     : verifyPaymentCtrl
* Parameters     : req, res
* Description    : Verify Razorpay payment signature and submit membership
***************************************************************************************/
exports.verifyPaymentCtrl = function (req, res) {
    var fnm = "verifyPaymentCtrl";
    log.info(`In ${fnm}`, 0, cntxtDtls);

    var reqBody = req.body.data || req.body;

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        memberData
    } = reqBody;

    // Verify signature
    const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        // Payment signature verification failed
        paymentMdl.updatePaymentTransactionMdl({
            razorpay_order_id: razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            status: 'failed',
            response: { error: 'Signature verification failed' }
        });

        return df.formatErrorRes(res, null, cntxtDtls, null, {
            "error_status": 400,
            "err_message": "Payment verification failed. Please contact support."
        });
    }

    // Signature verified successfully
    // Update payment transaction
    paymentMdl.updatePaymentTransactionMdl({
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        status: 'success',
        method: memberData.payment_method || 'upi',
        response: reqBody
    })
    .then(function () {
        // Check if Aadhar already exists
        return safMdl.checkAadharExistsMdl(memberData.aadhar_no);
    })
    .then(function (results) {
        if (results && results.length > 0) {
            // Aadhar already exists
            return Promise.reject({
                custom: true,
                message: `Aadhar number already registered. Member: ${results[0].fll_nm}, Phone: ${results[0].phne_no}`
            });
        }
        
        // Insert new membership with paid status
        return safMdl.insertMembershipMdl(memberData);
    })
    .then(function (insertResult) {
        if (insertResult && insertResult.insertId) {
            const member_id = insertResult.insertId;
            
            // Get payment transaction ID
            return paymentMdl.getPaymentByOrderIdMdl(razorpay_order_id)
                .then(function (paymentResult) {
                    if (paymentResult && paymentResult.length > 0) {
                        const payment_transaction_id = paymentResult[0].pymnt_trnsctn_id;
                        
                        // Link payment to member
                        return Promise.all([
                            paymentMdl.linkPaymentToMemberMdl(member_id, payment_transaction_id),
                            paymentMdl.updateMemberPaymentTransactionMdl(member_id, payment_transaction_id)
                        ]).then(function () {
                            return {
                                member_id: member_id,
                                payment_transaction_id: payment_transaction_id
                            };
                        });
                    }
                    return { member_id: member_id };
                });
        } else {
            return Promise.reject({
                custom: true,
                message: "Failed to register membership. Please contact support."
            });
        }
    })
    .then(function (data) {
        return df.formatSucessRes(req, res, {
            member_id: data.member_id,
            payment_id: razorpay_payment_id,
            message: "Payment successful! Membership activated."
        }, cntxtDtls, fnm, {
            "success_msg": "Welcome to SAF Sabyam! Your membership is now active."
        });
    })
    .catch(function (error) {
        if (error.custom) {
            return df.formatErrorRes(res, null, cntxtDtls, null, {
                "error_status": 400,
                "err_message": error.message
            });
        }
        return df.formatErrorRes(res, error, cntxtDtls, fnm, {});
    });
};

