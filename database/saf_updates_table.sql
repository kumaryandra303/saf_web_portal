-- SAF Updates Table
CREATE TABLE IF NOT EXISTS saf_updates_t (
    saf_updt_id INT AUTO_INCREMENT PRIMARY KEY,
    updt_ttl_en VARCHAR(500) NOT NULL COMMENT 'Update Title in English',
    updt_ttl_te VARCHAR(500) NOT NULL COMMENT 'Update Title in Telugu',
    updt_cntnt_en TEXT NOT NULL COMMENT 'Update Content in English',
    updt_cntnt_te TEXT NOT NULL COMMENT 'Update Content in Telugu',
    updt_typ_cd VARCHAR(50) NOT NULL COMMENT 'Update Type: announcement, fundsUtilization, communityEvent',
    updt_dt DATE NOT NULL COMMENT 'Update Date',
    img_1_pth VARCHAR(500) NULL COMMENT 'First Image Path',
    img_2_pth VARCHAR(500) NULL COMMENT 'Second Image Path',
    img_3_pth VARCHAR(500) NULL COMMENT 'Third Image Path',
    a_in TINYINT(1) DEFAULT 1 COMMENT 'Active Indicator',
    i_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Insert Timestamp',
    u_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Timestamp',
    crte_usr_id INT NULL COMMENT 'Created User ID',
    updte_usr_id INT NULL COMMENT 'Updated User ID',
    INDEX idx_updt_dt (updt_dt),
    INDEX idx_updt_typ (updt_typ_cd),
    INDEX idx_a_in (a_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SAF Updates/News Table';



