-- SAF Web Portal Database Schema
-- This file contains the essential database tables for authentication and user management

-- Create database
CREATE DATABASE IF NOT EXISTS saf_db;
USE saf_db;

-- User List Table
CREATE TABLE IF NOT EXISTS `usr_lst_t` (
  `usr_id` INT NOT NULL AUTO_INCREMENT,
  `usr_nm` VARCHAR(100) NOT NULL UNIQUE,
  `pwd_tx` VARCHAR(255) NOT NULL,
  `fst_nm` VARCHAR(100) NULL,
  `lst_nm` VARCHAR(100) NULL,
  `eml_tx` VARCHAR(255) NULL,
  `phn_no` VARCHAR(20) NULL,
  `a_in` TINYINT(1) DEFAULT 1 COMMENT 'Active Indicator',
  `crte_usr_id` INT NULL,
  `updte_usr_id` INT NULL,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Client Details Table
CREATE TABLE IF NOT EXISTS `clnt_dtl_t` (
  `clnt_id` INT NOT NULL AUTO_INCREMENT,
  `clnt_nm` VARCHAR(200) NOT NULL,
  `clnt_dsply_nm` VARCHAR(200) NULL,
  `clnt_scndy_dsply_nm` VARCHAR(200) NULL,
  `clnt_lgo_url_tx` VARCHAR(500) NULL,
  `clnt_loc` VARCHAR(200) NULL,
  `lat` DECIMAL(10,7) NULL,
  `lng` DECIMAL(10,7) NULL,
  `a_in` TINYINT(1) DEFAULT 1,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`clnt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Client Tenant List Table
CREATE TABLE IF NOT EXISTS `clnt_tnt_lst_t` (
  `tnt_id` INT NOT NULL AUTO_INCREMENT,
  `clnt_id` INT NOT NULL,
  `tnt_nm` VARCHAR(200) NOT NULL,
  `tnt_dsply_nm` VARCHAR(200) NULL,
  `tnt_scndy_dsply_nm` VARCHAR(200) NULL,
  `tnt_lgo_url_tx` VARCHAR(500) NULL,
  `lat` DECIMAL(10,7) NULL,
  `lng` DECIMAL(10,7) NULL,
  `urbn_in` TINYINT(1) DEFAULT 0,
  `a_in` TINYINT(1) DEFAULT 1,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tnt_id`),
  FOREIGN KEY (`clnt_id`) REFERENCES `clnt_dtl_t`(`clnt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Role List Table
CREATE TABLE IF NOT EXISTS `usr_rle_lst_t` (
  `rle_id` INT NOT NULL AUTO_INCREMENT,
  `rle_nm` VARCHAR(100) NOT NULL,
  `rle_dscrn_tx` TEXT NULL,
  `admn_rle_in` TINYINT(1) DEFAULT 0,
  `clnt_id` INT NULL,
  `tnt_id` INT NULL,
  `a_in` TINYINT(1) DEFAULT 1,
  `crte_usr_id` INT NULL,
  `updte_usr_id` INT NULL,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Designation List Table
CREATE TABLE IF NOT EXISTS `usr_dsgns_lst_t` (
  `dsgns_id` INT NOT NULL AUTO_INCREMENT,
  `dsgns_nm` VARCHAR(100) NOT NULL,
  `a_in` TINYINT(1) DEFAULT 1,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`dsgns_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Client Tenant Relation Table
CREATE TABLE IF NOT EXISTS `usr_clnt_tnt_rel_t` (
  `usr_clnt_tnt_rel_id` INT NOT NULL AUTO_INCREMENT,
  `usr_id` INT NOT NULL,
  `clnt_id` INT NOT NULL,
  `tnt_id` INT NOT NULL,
  `rle_id` INT NULL,
  `dsgns_id` INT NULL,
  `app_prfle_id` INT NULL,
  `clnt_admn_in` TINYINT(1) DEFAULT 0,
  `tnt_admn_in` TINYINT(1) DEFAULT 0,
  `hyrchy_id` INT NULL,
  `hyrchy_ky` VARCHAR(100) NULL,
  `fl_trk_tckt_in` TINYINT(1) DEFAULT 0,
  `a_in` TINYINT(1) DEFAULT 1,
  `crte_usr_id` INT NULL,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usr_clnt_tnt_rel_id`),
  FOREIGN KEY (`usr_id`) REFERENCES `usr_lst_t`(`usr_id`),
  FOREIGN KEY (`clnt_id`) REFERENCES `clnt_dtl_t`(`clnt_id`),
  FOREIGN KEY (`tnt_id`) REFERENCES `clnt_tnt_lst_t`(`tnt_id`),
  FOREIGN KEY (`rle_id`) REFERENCES `usr_rle_lst_t`(`rle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Captcha List Table
CREATE TABLE IF NOT EXISTS `usr_cptch_lst_t` (
  `cptch_id` INT NOT NULL AUTO_INCREMENT,
  `cptch_txt` VARCHAR(50) NOT NULL,
  `cptch_slt_ky` VARCHAR(50) NOT NULL,
  `a_in` TINYINT(1) DEFAULT 1,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cptch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OTP List Table
CREATE TABLE IF NOT EXISTS `usr_otp_lst_t` (
  `otp_id` INT NOT NULL AUTO_INCREMENT,
  `email_id` VARCHAR(255) NOT NULL,
  `code` VARCHAR(10) NOT NULL,
  `uuid` VARCHAR(100) NULL,
  `atmpt_ct` INT DEFAULT 0,
  `cmpnt_id` INT NULL,
  `jsn_tx` TEXT NULL,
  `usr_id` INT NULL,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `u_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`otp_id`),
  FOREIGN KEY (`usr_id`) REFERENCES `usr_lst_t`(`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Login History Table
CREATE TABLE IF NOT EXISTS `usr_lgn_hstry_dtl_t` (
  `lgn_hstry_id` INT NOT NULL AUTO_INCREMENT,
  `usr_id` INT NOT NULL,
  `cmpnt_ctgry_id` INT NULL COMMENT '1=Web, 2=App',
  `ctzn_in` TINYINT(1) DEFAULT 0,
  `clnt_id` INT NULL,
  `tnt_id` INT NULL,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`lgn_hstry_id`),
  FOREIGN KEY (`usr_id`) REFERENCES `usr_lst_t`(`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Session Table
CREATE TABLE IF NOT EXISTS `user_session_dtl_t` (
  `session_id` VARCHAR(128) NOT NULL,
  `expires` INT UNSIGNED NOT NULL,
  `token` TEXT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Profile Category List Table
CREATE TABLE IF NOT EXISTS `app_prfle_ctgry_lst_t` (
  `prfle_ctgry_id` INT NOT NULL AUTO_INCREMENT,
  `prfle_ctgry_nm` VARCHAR(100) NOT NULL,
  `prfle_ctgry_cd` VARCHAR(50) NULL,
  `a_in` TINYINT(1) DEFAULT 1,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prfle_ctgry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Profile List Table
CREATE TABLE IF NOT EXISTS `app_prfle_lst_t` (
  `prfle_id` INT NOT NULL AUTO_INCREMENT,
  `prfle_nm` VARCHAR(100) NOT NULL,
  `prfle_ctgry_id` INT NOT NULL,
  `prfle_ctgry_cd` VARCHAR(50) NULL,
  `prfle_dshbd_url_tx` VARCHAR(500) NULL,
  `a_in` TINYINT(1) DEFAULT 1,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prfle_id`),
  FOREIGN KEY (`prfle_ctgry_id`) REFERENCES `app_prfle_ctgry_lst_t`(`prfle_ctgry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Profile Role Relation Table
CREATE TABLE IF NOT EXISTS `app_prfle_rle_rel_t` (
  `prfle_rle_rel_id` INT NOT NULL AUTO_INCREMENT,
  `prfle_id` INT NOT NULL,
  `rle_id` INT NOT NULL,
  `clnt_id` INT NOT NULL,
  `tnt_id` INT NOT NULL,
  `a_in` TINYINT(1) DEFAULT 1,
  `i_ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prfle_rle_rel_id`),
  FOREIGN KEY (`prfle_id`) REFERENCES `app_prfle_lst_t`(`prfle_id`),
  FOREIGN KEY (`rle_id`) REFERENCES `usr_rle_lst_t`(`rle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data
-- Default client
INSERT INTO `clnt_dtl_t` (`clnt_nm`, `clnt_dsply_nm`) VALUES 
('SAF Organization', 'SAF');

-- Default tenant
INSERT INTO `clnt_tnt_lst_t` (`clnt_id`, `tnt_nm`, `tnt_dsply_nm`) VALUES 
(1, 'SAF Main', 'SAF Main Branch');

-- Default role
INSERT INTO `usr_rle_lst_t` (`rle_nm`, `rle_dscrn_tx`, `admn_rle_in`, `clnt_id`, `tnt_id`) VALUES 
('Administrator', 'System Administrator', 1, 1, 1);

-- Default user (username: admin, password: Admin@123)
-- Password is SHA512 hash of 'Admin@123'
INSERT INTO `usr_lst_t` (`usr_nm`, `pwd_tx`, `fst_nm`, `lst_nm`, `eml_tx`) VALUES 
('admin', 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', 'System', 'Administrator', 'admin@saf.org');

-- Link user to client and tenant
INSERT INTO `usr_clnt_tnt_rel_t` (`usr_id`, `clnt_id`, `tnt_id`, `rle_id`, `clnt_admn_in`, `tnt_admn_in`) VALUES 
(1, 1, 1, 1, 1, 1);

-- Insert profile categories
INSERT INTO `app_prfle_ctgry_lst_t` (`prfle_ctgry_nm`, `prfle_ctgry_cd`) VALUES 
('Menu Profile', 'MENU'),
('Setup Profile', 'SETUP'),
('Report Profile', 'REPORT'),
('Help Profile', 'HELP');

-- Insert default profiles
INSERT INTO `app_prfle_lst_t` (`prfle_nm`, `prfle_ctgry_id`, `prfle_dshbd_url_tx`) VALUES 
('Admin Menu', 1, '/dashboard'),
('Admin Setup', 2, '/setup'),
('Admin Reports', 3, '/reports'),
('Admin Help', 4, '/help');

-- Link profiles to admin role
INSERT INTO `app_prfle_rle_rel_t` (`prfle_id`, `rle_id`, `clnt_id`, `tnt_id`) VALUES 
(1, 1, 1, 1),
(2, 1, 1, 1),
(3, 1, 1, 1),
(4, 1, 1, 1);





