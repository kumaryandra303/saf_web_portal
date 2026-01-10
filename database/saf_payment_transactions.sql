-- SAF Payment Transactions Table
-- This table stores all payment transaction details for SAF Sabyam memberships

CREATE TABLE IF NOT EXISTS `saf_pymnt_trnsctn_t` (
  `pymnt_trnsctn_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key - Payment Transaction ID',
  `saf_mmbr_id` INT(11) DEFAULT NULL COMMENT 'SAF Member ID (FK after membership created)',
  `rzrpy_ordr_id` VARCHAR(255) NOT NULL COMMENT 'Razorpay Order ID',
  `rzrpy_pymnt_id` VARCHAR(255) DEFAULT NULL COMMENT 'Razorpay Payment ID',
  `rzrpy_sgntr` TEXT DEFAULT NULL COMMENT 'Razorpay Signature for verification',
  `pymnt_amnt` DECIMAL(10,2) NOT NULL COMMENT 'Payment Amount (in Rupees)',
  `pymnt_crrncy` VARCHAR(10) NOT NULL DEFAULT 'INR' COMMENT 'Payment Currency',
  `pymnt_stts` VARCHAR(50) NOT NULL DEFAULT 'pending' COMMENT 'Payment Status (pending/success/failed)',
  `pymnt_mthd` VARCHAR(50) DEFAULT NULL COMMENT 'Payment Method (upi/card/netbanking/wallet)',
  `upi_id` VARCHAR(255) DEFAULT NULL COMMENT 'UPI ID if payment via UPI',
  `vpa` VARCHAR(255) DEFAULT NULL COMMENT 'Virtual Payment Address',
  `bnk_nm` VARCHAR(255) DEFAULT NULL COMMENT 'Bank Name',
  `crd_id` VARCHAR(255) DEFAULT NULL COMMENT 'Card ID (last 4 digits)',
  `wllt_nm` VARCHAR(100) DEFAULT NULL COMMENT 'Wallet Name (PhonePe/GPay/Paytm)',
  `pymnt_dt` TIMESTAMP NULL DEFAULT NULL COMMENT 'Payment Date and Time',
  `rspns_jsn` TEXT DEFAULT NULL COMMENT 'Full Razorpay Response JSON',
  `err_msg` TEXT DEFAULT NULL COMMENT 'Error Message if payment failed',
  `a_in` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active Indicator (1=Active, 0=Inactive)',
  `i_ts` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Insert Timestamp',
  `u_ts` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Timestamp',
  PRIMARY KEY (`pymnt_trnsctn_id`),
  UNIQUE KEY `uk_rzrpy_ordr_id` (`rzrpy_ordr_id`),
  KEY `idx_rzrpy_pymnt_id` (`rzrpy_pymnt_id`),
  KEY `idx_saf_mmbr_id` (`saf_mmbr_id`),
  KEY `idx_pymnt_stts` (`pymnt_stts`),
  KEY `idx_pymnt_dt` (`pymnt_dt`),
  KEY `idx_a_in` (`a_in`),
  CONSTRAINT `fk_pymnt_saf_mmbr` FOREIGN KEY (`saf_mmbr_id`) REFERENCES `saf_mmbr_lst_t` (`saf_mmbr_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SAF Payment Transactions Table';

-- Add indexes for better query performance
CREATE INDEX idx_i_ts ON saf_pymnt_trnsctn_t(i_ts);
CREATE INDEX idx_pymnt_mthd ON saf_pymnt_trnsctn_t(pymnt_mthd);


