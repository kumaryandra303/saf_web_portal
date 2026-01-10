-- Test if captcha table exists and is accessible
USE saf_db;

-- Show if table exists
SHOW TABLES LIKE 'usr_cptch_lst_t';

-- Show table structure
DESCRIBE usr_cptch_lst_t;

-- Try to insert a test record
INSERT INTO usr_cptch_lst_t(cptch_txt, cptch_slt_ky, i_ts)
VALUES('TEST123', 'abc123def456', CURRENT_TIMESTAMP());

-- Check if it inserted
SELECT * FROM usr_cptch_lst_t ORDER BY i_ts DESC LIMIT 1;

-- Clean up test record
DELETE FROM usr_cptch_lst_t WHERE cptch_txt = 'TEST123';




