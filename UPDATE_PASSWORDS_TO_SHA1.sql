-- ============================================================================
-- SAF Admin Portal - Password Migration to SHA1
-- ============================================================================
-- This script shows how to update existing user passwords to work with SHA1
-- 
-- OLD SYSTEM: Passwords stored as SHA512, compared with MD5(MD5(SHA512) + saltKey)
-- NEW SYSTEM: Passwords stored as plain text, compared with SHA1(plain_text)
--
-- IMPORTANT: You need to reset all user passwords after this migration
-- ============================================================================

USE saf_db;

-- ============================================================================
-- METHOD 1: Update specific user with known plain password
-- ============================================================================
-- If you know the plain text password, update it directly:

UPDATE usr_lst_t 
SET pwd_tx = 'YourPlainPassword123'  -- Store plain password
WHERE usr_nm = 'admin';

-- Example: Set admin password to 'Admin@123'
UPDATE usr_lst_t 
SET pwd_tx = 'Admin@123'
WHERE usr_nm = 'admin';

-- ============================================================================
-- METHOD 2: Force password reset for all users
-- ============================================================================
-- Set a temporary password for all users and ask them to reset

UPDATE usr_lst_t 
SET pwd_tx = 'TempPassword123!',
    u_ts = CURRENT_TIMESTAMP()
WHERE a_in = 1;

-- Then notify users to login with 'TempPassword123!' and change password

-- ============================================================================
-- METHOD 3: Create test user with SHA1-compatible password
-- ============================================================================

-- Create a test admin user
INSERT INTO usr_lst_t (usr_nm, pwd_tx, fst_nm, lst_nm, eml_tx, a_in, i_ts)
VALUES ('testadmin', 'TestPass123', 'Test', 'Admin', 'test@saf.org', 1, CURRENT_TIMESTAMP());

-- Get the usr_id (replace 1 with actual user id after insert)
SET @test_usr_id = LAST_INSERT_ID();

-- Link to client and tenant
INSERT INTO usr_clnt_tnt_rel_t (usr_id, clnt_id, tnt_id, rle_id, a_in, i_ts)
SELECT @test_usr_id, 1, 1, 1, 1, CURRENT_TIMESTAMP()
WHERE EXISTS (SELECT 1 FROM clnt_dtl_t WHERE clnt_id = 1);

-- ============================================================================
-- VERIFICATION: Test SHA1 comparison
-- ============================================================================

-- Test if password 'Admin@123' matches for user 'admin'
SELECT 
    usr_id,
    usr_nm,
    pwd_tx,
    SHA1(pwd_tx) as sha1_hash,
    CASE 
        WHEN SHA1(pwd_tx) = SHA1('Admin@123') THEN 'Password Matches!'
        ELSE 'Password Does NOT Match'
    END as password_test
FROM usr_lst_t 
WHERE usr_nm = 'admin';

-- ============================================================================
-- EXAMPLE: How login query works now
-- ============================================================================

-- Frontend sends: SHA1('Admin@123') = '6367c48dd193d56ea7b0baad25b19455e529f5ee'
-- Backend compares with: SHA1(pwd_tx stored in database)

-- Example login query (this is what happens in backend):
SELECT u.usr_id, u.usr_nm, u.fst_nm, u.lst_nm 
FROM usr_lst_t u
LEFT JOIN usr_clnt_tnt_rel_t au ON au.usr_id = u.usr_id
WHERE u.usr_nm = 'admin'
  AND au.a_in = 1
  AND SHA1(pwd_tx) = SHA1('Admin@123')  -- Compares SHA1 hashes
  AND u.a_in = 1;

-- ============================================================================
-- LIST ALL USERS (for reference)
-- ============================================================================

SELECT 
    usr_id,
    usr_nm as username,
    CONCAT(fst_nm, ' ', lst_nm) as full_name,
    eml_tx as email,
    a_in as is_active,
    LENGTH(pwd_tx) as password_length,
    i_ts as created_at
FROM usr_lst_t
ORDER BY usr_id;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Passwords are now stored as PLAIN TEXT in database
-- 2. SHA1 hashing happens ONLY during comparison in SQL query
-- 3. Frontend sends SHA1(password) to backend
-- 4. Backend compares: SHA1(stored_plain_password) = SHA1(user_entered_password)
-- 5. This is a simplified system - consider using bcrypt for production
--
-- SECURITY WARNING: Storing plain text passwords is NOT recommended!
-- For production, consider:
-- - Store SHA1 hashed passwords: UPDATE usr_lst_t SET pwd_tx = SHA1('password')
-- - Then compare: pwd_tx = SHA1('user_input')
-- - Or better: Use bcrypt with salt
-- ============================================================================






