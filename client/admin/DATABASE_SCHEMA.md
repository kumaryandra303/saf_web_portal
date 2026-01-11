# SAF Admin Portal - Database Schema

## Database Information
**Database Name:** `saf_db`  
**Engine:** MySQL/MariaDB  
**Charset:** utf8mb4_unicode_ci  
**Location:** Configured in `C:\SSSSSS\saf_web_portal\config\db.config.js`

---

## Tables Overview

| Table Name | Description | Primary Key | Records |
|------------|-------------|-------------|---------|
| usr_lst_t | User accounts | usr_id | Users |
| usr_clnt_tnt_rel_t | User-Client-Tenant relationships | usr_clnt_tnt_rel_id | Relations |
| usr_rle_lst_t | User roles | rle_id | Roles |
| usr_dsgns_lst_t | User designations | dsgns_id | Designations |
| clnt_dtl_t | Client details | clnt_id | Clients |
| clnt_tnt_lst_t | Tenant list | tnt_id | Tenants |
| usr_cptch_lst_t | Captcha storage | cptch_id | Captchas |
| usr_otp_lst_t | OTP records | otp_id | OTPs |
| usr_lgn_hstry_dtl_t | Login history | lgn_hstry_id | History |
| user_session_dtl_t | Session storage | session_id | Sessions |
| app_prfle_lst_t | Application profiles | prfle_id | Profiles |
| app_prfle_rle_rel_t | Profile-Role relations | prfle_rle_rel_id | Relations |
| app_prfle_ctgry_lst_t | Profile categories | prfle_ctgry_id | Categories |

---

## Table Structures

### 1. usr_lst_t (User List Table)
**Purpose:** Store user account information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| usr_id | INT | PRIMARY KEY, AUTO_INCREMENT | User ID |
| usr_nm | VARCHAR(100) | NOT NULL, UNIQUE | Username (login) |
| pwd_tx | VARCHAR(255) | NOT NULL | Password (SHA512 hashed) |
| fst_nm | VARCHAR(100) | NULL | First name |
| lst_nm | VARCHAR(100) | NULL | Last name |
| eml_tx | VARCHAR(255) | NULL | Email address |
| phn_no | VARCHAR(20) | NULL | Phone number |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator (1=active, 0=inactive) |
| crte_usr_id | INT | NULL | Creator user ID |
| updte_usr_id | INT | NULL | Last updater user ID |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

**Indexes:**
- PRIMARY KEY (usr_id)
- UNIQUE KEY (usr_nm)

---

### 2. usr_clnt_tnt_rel_t (User-Client-Tenant Relation Table)
**Purpose:** Manage user relationships with clients and tenants

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| usr_clnt_tnt_rel_id | INT | PRIMARY KEY, AUTO_INCREMENT | Relation ID |
| usr_id | INT | NOT NULL, FK(usr_lst_t) | User ID |
| clnt_id | INT | NOT NULL, FK(clnt_dtl_t) | Client ID |
| tnt_id | INT | NOT NULL, FK(clnt_tnt_lst_t) | Tenant ID |
| rle_id | INT | NULL, FK(usr_rle_lst_t) | Role ID |
| dsgns_id | INT | NULL | Designation ID |
| app_prfle_id | INT | NULL | Application profile ID |
| clnt_admn_in | TINYINT(1) | DEFAULT 0 | Client admin indicator |
| tnt_admn_in | TINYINT(1) | DEFAULT 0 | Tenant admin indicator |
| hyrchy_id | INT | NULL | Hierarchy ID |
| hyrchy_ky | VARCHAR(100) | NULL | Hierarchy key |
| fl_trk_tckt_in | TINYINT(1) | DEFAULT 0 | Full track ticket indicator |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| crte_usr_id | INT | NULL | Creator user ID |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

**Foreign Keys:**
- usr_id → usr_lst_t(usr_id)
- clnt_id → clnt_dtl_t(clnt_id)
- tnt_id → clnt_tnt_lst_t(tnt_id)
- rle_id → usr_rle_lst_t(rle_id)

---

### 3. usr_rle_lst_t (User Role List Table)
**Purpose:** Define user roles and permissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rle_id | INT | PRIMARY KEY, AUTO_INCREMENT | Role ID |
| rle_nm | VARCHAR(100) | NOT NULL | Role name |
| rle_dscrn_tx | TEXT | NULL | Role description |
| admn_rle_in | TINYINT(1) | DEFAULT 0 | Admin role indicator |
| clnt_id | INT | NULL | Client ID (role scope) |
| tnt_id | INT | NULL | Tenant ID (role scope) |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| crte_usr_id | INT | NULL | Creator user ID |
| updte_usr_id | INT | NULL | Last updater user ID |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

---

### 4. usr_dsgns_lst_t (User Designation List Table)
**Purpose:** Store user job designations/titles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| dsgns_id | INT | PRIMARY KEY, AUTO_INCREMENT | Designation ID |
| dsgns_nm | VARCHAR(100) | NOT NULL | Designation name |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

---

### 5. clnt_dtl_t (Client Details Table)
**Purpose:** Store client/organization information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| clnt_id | INT | PRIMARY KEY, AUTO_INCREMENT | Client ID |
| clnt_nm | VARCHAR(200) | NOT NULL | Client name |
| clnt_dsply_nm | VARCHAR(200) | NULL | Display name |
| clnt_scndy_dsply_nm | VARCHAR(200) | NULL | Secondary display name |
| clnt_lgo_url_tx | VARCHAR(500) | NULL | Logo URL |
| clnt_loc | VARCHAR(200) | NULL | Location |
| lat | DECIMAL(10,7) | NULL | Latitude |
| lng | DECIMAL(10,7) | NULL | Longitude |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

---

### 6. clnt_tnt_lst_t (Client Tenant List Table)
**Purpose:** Manage tenants under clients

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| tnt_id | INT | PRIMARY KEY, AUTO_INCREMENT | Tenant ID |
| clnt_id | INT | NOT NULL, FK(clnt_dtl_t) | Client ID |
| tnt_nm | VARCHAR(200) | NOT NULL | Tenant name |
| tnt_dsply_nm | VARCHAR(200) | NULL | Display name |
| tnt_scndy_dsply_nm | VARCHAR(200) | NULL | Secondary display name |
| tnt_lgo_url_tx | VARCHAR(500) | NULL | Logo URL |
| lat | DECIMAL(10,7) | NULL | Latitude |
| lng | DECIMAL(10,7) | NULL | Longitude |
| urbn_in | TINYINT(1) | DEFAULT 0 | Urban indicator |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

**Foreign Keys:**
- clnt_id → clnt_dtl_t(clnt_id)

---

### 7. usr_cptch_lst_t (User Captcha List Table)
**Purpose:** Store captcha challenges for authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| cptch_id | INT | PRIMARY KEY, AUTO_INCREMENT | Captcha ID |
| cptch_txt | VARCHAR(50) | NOT NULL | Captcha text (solution) |
| cptch_slt_ky | VARCHAR(50) | NOT NULL | Salt key for encryption |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator (0 after use) |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

**Notes:**
- Captcha is deactivated (a_in=0) after validation
- Old records (>1 hour) are automatically deleted
- One-time use only

---

### 8. usr_otp_lst_t (User OTP List Table)
**Purpose:** Manage OTP for password reset

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| otp_id | INT | PRIMARY KEY, AUTO_INCREMENT | OTP ID |
| email_id | VARCHAR(255) | NOT NULL | User email address |
| code | VARCHAR(10) | NOT NULL | OTP code |
| uuid | VARCHAR(100) | NULL | Unique identifier |
| atmpt_ct | INT | DEFAULT 0 | Attempt count |
| cmpnt_id | INT | NULL | Component ID (1=Web, 2=App) |
| jsn_tx | TEXT | NULL | JSON data (username, email) |
| usr_id | INT | NULL, FK(usr_lst_t) | User ID |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |
| u_ts | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Update timestamp |

**Foreign Keys:**
- usr_id → usr_lst_t(usr_id)

**Business Rules:**
- Maximum 3 attempts per day per email
- Valid for 30 minutes from generation
- Increment attempt count on resend

---

### 9. usr_lgn_hstry_dtl_t (User Login History Details Table)
**Purpose:** Track user login history

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lgn_hstry_id | INT | PRIMARY KEY, AUTO_INCREMENT | Login history ID |
| usr_id | INT | NOT NULL, FK(usr_lst_t) | User ID |
| cmpnt_ctgry_id | INT | NULL | Component category (1=Web, 2=App) |
| ctzn_in | TINYINT(1) | DEFAULT 0 | Citizen indicator |
| clnt_id | INT | NULL | Client ID |
| tnt_id | INT | NULL | Tenant ID |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Login timestamp |

**Foreign Keys:**
- usr_id → usr_lst_t(usr_id)

---

### 10. user_session_dtl_t (User Session Details Table)
**Purpose:** Store active user sessions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| session_id | VARCHAR(128) | PRIMARY KEY | Session ID |
| expires | INT UNSIGNED | NOT NULL | Expiration timestamp (Unix) |
| token | TEXT | NULL | Session data (JSON) |

**Notes:**
- Used by express-session with MySQL store
- Contains JWT token and user data
- Automatically cleaned up on expiration

---

### 11. app_prfle_ctgry_lst_t (App Profile Category List Table)
**Purpose:** Define profile categories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| prfle_ctgry_id | INT | PRIMARY KEY, AUTO_INCREMENT | Profile category ID |
| prfle_ctgry_nm | VARCHAR(100) | NOT NULL | Category name |
| prfle_ctgry_cd | VARCHAR(50) | NULL | Category code |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |

**Categories:**
- Menu Profile
- Setup Profile
- Report Profile
- Help Profile

---

### 12. app_prfle_lst_t (App Profile List Table)
**Purpose:** Define application profiles/modules

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| prfle_id | INT | PRIMARY KEY, AUTO_INCREMENT | Profile ID |
| prfle_nm | VARCHAR(100) | NOT NULL | Profile name |
| prfle_ctgry_id | INT | NOT NULL, FK | Profile category ID |
| prfle_ctgry_cd | VARCHAR(50) | NULL | Category code |
| prfle_dshbd_url_tx | VARCHAR(500) | NULL | Dashboard URL path |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |

**Foreign Keys:**
- prfle_ctgry_id → app_prfle_ctgry_lst_t(prfle_ctgry_id)

---

### 13. app_prfle_rle_rel_t (App Profile Role Relation Table)
**Purpose:** Map profiles to roles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| prfle_rle_rel_id | INT | PRIMARY KEY, AUTO_INCREMENT | Relation ID |
| prfle_id | INT | NOT NULL, FK | Profile ID |
| rle_id | INT | NOT NULL, FK | Role ID |
| clnt_id | INT | NOT NULL | Client ID |
| tnt_id | INT | NOT NULL | Tenant ID |
| a_in | TINYINT(1) | DEFAULT 1 | Active indicator |
| i_ts | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Insert timestamp |

**Foreign Keys:**
- prfle_id → app_prfle_lst_t(prfle_id)
- rle_id → usr_rle_lst_t(rle_id)

---

## Relationships Diagram

```
usr_lst_t
    ├── usr_clnt_tnt_rel_t
    │   ├── clnt_dtl_t
    │   ├── clnt_tnt_lst_t
    │   └── usr_rle_lst_t
    │       └── app_prfle_rle_rel_t
    │           └── app_prfle_lst_t
    │               └── app_prfle_ctgry_lst_t
    ├── usr_otp_lst_t
    └── usr_lgn_hstry_dtl_t

usr_cptch_lst_t (standalone)
user_session_dtl_t (standalone)
usr_dsgns_lst_t (reference)
```

---

## Sample Queries

### Get User with Full Details
```sql
SELECT u.usr_id, u.usr_nm, u.fst_nm, u.lst_nm, u.eml_tx,
       au.clnt_id, au.tnt_id,
       c.clnt_nm, c.clnt_dsply_nm,
       t.tnt_nm, t.tnt_dsply_nm,
       r.rle_nm, r.admn_rle_in,
       d.dsgns_nm
FROM usr_lst_t u
LEFT JOIN usr_clnt_tnt_rel_t au ON au.usr_id = u.usr_id
LEFT JOIN clnt_dtl_t c ON au.clnt_id = c.clnt_id
LEFT JOIN clnt_tnt_lst_t t ON au.tnt_id = t.tnt_id
LEFT JOIN usr_rle_lst_t r ON au.rle_id = r.rle_id
LEFT JOIN usr_dsgns_lst_t d ON au.dsgns_id = d.dsgns_id
WHERE u.usr_nm = 'admin' AND u.a_in = 1;
```

### Get User Assigned Profiles
```sql
SELECT apr.rle_id, apr.prfle_id, 
       apl.prfle_nm, apl.prfle_ctgry_cd,
       CONCAT('internal', prfle_dshbd_url_tx) as prfle_dshbd_url_tx,
       apl.prfle_ctgry_id, apc.prfle_ctgry_nm 
FROM app_prfle_rle_rel_t apr
LEFT JOIN app_prfle_lst_t apl ON apr.prfle_id = apl.prfle_id
JOIN app_prfle_ctgry_lst_t apc ON apl.prfle_ctgry_id = apc.prfle_ctgry_id
WHERE apr.rle_id = ? AND apr.a_in = 1 
  AND apr.clnt_id = ? AND apr.tnt_id = ?
ORDER BY apl.prfle_id;
```

---

## Indexes & Performance

### Recommended Indexes
```sql
-- User lookups
CREATE INDEX idx_usr_nm ON usr_lst_t(usr_nm);
CREATE INDEX idx_usr_email ON usr_lst_t(eml_tx);

-- User-Client-Tenant relationships
CREATE INDEX idx_usr_clnt_tnt_usr ON usr_clnt_tnt_rel_t(usr_id);
CREATE INDEX idx_usr_clnt_tnt_clnt ON usr_clnt_tnt_rel_t(clnt_id, tnt_id);

-- Sessions
CREATE INDEX idx_session_expires ON user_session_dtl_t(expires);

-- Login history
CREATE INDEX idx_lgn_usr ON usr_lgn_hstry_dtl_t(usr_id);
CREATE INDEX idx_lgn_ts ON usr_lgn_hstry_dtl_t(i_ts);

-- Captcha cleanup
CREATE INDEX idx_cptch_ts ON usr_cptch_lst_t(i_ts);
```

---

## Data Maintenance

### Cleanup Jobs
```sql
-- Delete old captcha records (run hourly)
DELETE FROM usr_cptch_lst_t 
WHERE i_ts < CURRENT_TIMESTAMP() - INTERVAL 1 HOUR;

-- Delete expired sessions (run daily)
DELETE FROM user_session_dtl_t 
WHERE expires < UNIX_TIMESTAMP();

-- Delete old OTP records (run daily)
DELETE FROM usr_otp_lst_t 
WHERE i_ts < CURRENT_TIMESTAMP() - INTERVAL 7 DAY;
```

---

## Security Notes

1. **Passwords:** Stored as SHA512 hash, never plain text
2. **Captcha:** One-time use, auto-deactivated
3. **Sessions:** Expire automatically, single session per user/app
4. **OTP:** Maximum 3 attempts, 30-minute validity
5. **Active Indicators:** Soft delete using a_in flag
6. **Timestamps:** All tables track creation and update times

---

## Initial Data Setup

See `schema.sql` in project root for:
- Default client (SAF Organization)
- Default tenant (Main)
- Default roles (Super Admin, Admin, User)
- Default designations (Administrator, Manager, Staff)
- Sample user (admin/password)
- Profile categories and profiles







