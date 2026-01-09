-- SAF Membership Table
-- This table stores member information for SAF Sabyam registrations

CREATE TABLE IF NOT EXISTS `saf_mmbr_lst_t` (
  `saf_mmbr_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key - SAF Member ID',
  `fll_nm` VARCHAR(255) NOT NULL COMMENT 'Full Name',
  `fthr_nm` VARCHAR(255) NOT NULL COMMENT 'Father Name',
  `dob_dt` DATE NOT NULL COMMENT 'Date of Birth',
  `gndr_cd` VARCHAR(20) NOT NULL COMMENT 'Gender Code (male/female/other)',
  `phne_no` VARCHAR(10) NOT NULL COMMENT 'Phone Number (10 digits)',
  `eml_tx` VARCHAR(255) DEFAULT NULL COMMENT 'Email Address',
  `adrs_tx` TEXT NOT NULL COMMENT 'Address',
  `dstrt_id` bigint(20) NOT NULL COMMENT 'District ID (FK to dstrt_lst_t)',
  `mndl_id` bigint(20) NOT NULL COMMENT 'Mandal ID (FK to mndl_lst_t)',
  `pncd_no` VARCHAR(6) NOT NULL COMMENT 'Pincode (6 digits)',
  `adhr_no` VARCHAR(12) NOT NULL COMMENT 'Aadhar Number (12 digits) - UNIQUE',
  `occptn_tx` VARCHAR(255) DEFAULT NULL COMMENT 'Occupation',
  `edctn_tx` VARCHAR(255) DEFAULT NULL COMMENT 'Education',
  
  -- Payment fields
  `pymt_stts_cd` VARCHAR(20) DEFAULT 'PENDING' COMMENT 'Payment Status (PENDING/SUCCESS/FAILED)',
  `rzrpy_ordr_id` VARCHAR(100) DEFAULT NULL COMMENT 'Razorpay Order ID',
  `rzrpy_pymt_id` VARCHAR(100) DEFAULT NULL COMMENT 'Razorpay Payment ID',
  `rzrpy_sgntr` VARCHAR(255) DEFAULT NULL COMMENT 'Razorpay Signature',
  `pymt_amnt` DECIMAL(10,2) DEFAULT 20.00 COMMENT 'Payment Amount (INR)',
  `pymt_mthd` VARCHAR(50) DEFAULT NULL COMMENT 'Payment Method (UPI/Card/NetBanking)',
  `pymt_dt` TIMESTAMP NULL DEFAULT NULL COMMENT 'Payment Date & Time',
  `trnstn_jsn` TEXT DEFAULT NULL COMMENT 'Full Transaction JSON from Razorpay',
  
  `a_in` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active Indicator (1=Active, 0=Inactive)',
  `i_ts` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Insert Timestamp',
  `u_ts` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Timestamp',
  `crte_usr_id` INT(11) DEFAULT NULL COMMENT 'Created By User ID',
  `updte_usr_id` INT(11) DEFAULT NULL COMMENT 'Updated By User ID',
  PRIMARY KEY (`saf_mmbr_id`),
  UNIQUE KEY `uk_adhr_no` (`adhr_no`),
  UNIQUE KEY `uk_rzrpy_pymt_id` (`rzrpy_pymt_id`),
  KEY `idx_dstrt_id` (`dstrt_id`),
  KEY `idx_mndl_id` (`mndl_id`),
  KEY `idx_phne_no` (`phne_no`),
  KEY `idx_a_in` (`a_in`),
  KEY `idx_pymt_stts` (`pymt_stts_cd`),
  KEY `idx_rzrpy_ordr_id` (`rzrpy_ordr_id`),
  CONSTRAINT `fk_saf_mmbr_dstrt` FOREIGN KEY (`dstrt_id`) REFERENCES `dstrt_lst_t` (`dstrt_id`),
  CONSTRAINT `fk_saf_mmbr_mndl` FOREIGN KEY (`mndl_id`) REFERENCES `mndl_lst_t` (`mndl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SAF Membership List Table';

-- Add indexes for better query performance
CREATE INDEX idx_fll_nm ON saf_mmbr_lst_t(fll_nm);
CREATE INDEX idx_dob_dt ON saf_mmbr_lst_t(dob_dt);
CREATE INDEX idx_i_ts ON saf_mmbr_lst_t(i_ts);

