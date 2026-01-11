-- SAF Key People Table
-- This table stores information about key people in SAF (Patron, President, Secretary, etc.)

CREATE TABLE IF NOT EXISTS `saf_key_people_t` (
  `saf_key_prsn_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key - SAF Key Person ID',
  `fll_nm` VARCHAR(255) NOT NULL COMMENT 'Full Name',
  `dsgns_nm` VARCHAR(255) NOT NULL COMMENT 'Designation/Role (Patron, President, Secretary, etc.)',
  `rspnsblty_tx` TEXT DEFAULT NULL COMMENT 'Responsibilities Description',
  `img_pth` VARCHAR(500) DEFAULT NULL COMMENT 'Image Path/URL',
  `phne_no` VARCHAR(10) DEFAULT NULL COMMENT 'Phone Number',
  `eml_tx` VARCHAR(255) DEFAULT NULL COMMENT 'Email Address',
  `srt_ordr` INT(11) DEFAULT 0 COMMENT 'Sort Order for Display',
  `a_in` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active Indicator (1=Active, 0=Inactive)',
  `i_ts` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Insert Timestamp',
  `u_ts` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Timestamp',
  PRIMARY KEY (`saf_key_prsn_id`),
  KEY `idx_dsgns_nm` (`dsgns_nm`),
  KEY `idx_srt_ordr` (`srt_ordr`),
  KEY `idx_a_in` (`a_in`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SAF Key People Table';

-- Insert sample data
INSERT INTO `saf_key_people_t` (`fll_nm`, `dsgns_nm`, `rspnsblty_tx`, `srt_ordr`, `a_in`) VALUES
('Hon. Minister Vasamsetti Subhash', 'Patron & Minister', 'Leading SAF revival and community welfare initiatives', 1, 1),
('Community Leader', 'President', 'Overseeing program implementation', 2, 1),
('Community Leader', 'Secretary', 'Managing operations and outreach', 3, 1);

