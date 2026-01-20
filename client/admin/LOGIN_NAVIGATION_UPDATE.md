# Login Navigation Update

## Summary
Updated the authentication flow to properly parse the login response data and dynamically navigate to the `mnu_home_pg` URL returned from the backend.

## Changes Made

### 1. AuthContext.jsx (`src/context/AuthContext.jsx`)

**Updated `login` function to:**
- Store complete user data structure including:
  - User details (usr_id, names, email, etc.)
  - Roles and permissions (rle_nm, admn_rle_in)
  - Designation information (dsgns_id, dsgns_nm)
  - Client and tenant data (clnt_id, tnt_id, a_in)
  - Clients array with tenant information
  - Assigned profiles (menu, setup, report, help profiles)
  - QR code
- Save additional data to localStorage:
  - `saf_admin_user` - Complete user object
  - `saf_admin_clients` - Clients array
  - `saf_admin_profiles` - Assigned profiles object
  - `saf_admin_token` - JWT token
- Extract and return `mnu_home_pg` from `assignedProfiles`:
  - Returns as `homePageUrl` in the success response
  - Defaults to `/dashboard` if not provided

### 2. Login.jsx (`src/pages/auth/Login.jsx`)

**Updated `handleSubmit` function to:**
- Receive `homePageUrl` from login response
- Dynamically navigate to the returned home page URL
- Clean the URL by removing leading slashes before navigation
- Fallback to `/dashboard` if no URL is provided

## Example Response Structure

```json
{
  "status": 200,
  "data": {
    "user": {
      "usr_id": 1,
      "fst_nm": "System",
      "lst_nm": "Administrator",
      "usr_nm": "admin",
      "eml_tx": "admin@saf.org",
      "clnt_id": 1,
      "tnt_id": 1,
      "a_in": 1,
      "roles": {
        "rle_id": 1,
        "rle_nm": "Administrator",
        "admn_rle_in": 1
      },
      "dsgns": {
        "dsgns_id": null,
        "dsgns_nm": null
      }
    },
    "clnts": [
      {
        "clnt_id": 1,
        "clnt_nm": "SAF Organization",
        "clnt_dsply_nm": "SAF",
        "tnts": [
          {
            "tnt_id": 1,
            "tnt_nm": "SAF Main",
            "tnt_dsply_nm": "SAF Main Branch"
          }
        ]
      }
    ],
    "assignedProfiles": {
      "mnu_prfle": 1,
      "stp_prfle": 2,
      "rpt_prfle": 3,
      "hlp_prfle": 4,
      "mnu_home_pg": "internal/dashboard"
    },
    "qrcode": 374595
  }
}
```

## Navigation Flow

1. User submits login form
2. Frontend calls `login()` from AuthContext with credentials
3. AuthContext:
   - Encrypts password with SHA1
   - Sends request to backend API
   - Receives response with user data
   - Extracts `mnu_home_pg` from `assignedProfiles`
   - Saves all data to localStorage
   - Returns success with `homePageUrl`
4. Login component:
   - Receives success response with `homePageUrl`
   - Navigates to `homePageUrl` (e.g., `/internal/dashboard`)
   - Uses `replace: true` to prevent back navigation to login

## localStorage Structure

After successful login, the following data is stored:

- **`saf_admin_user`**: Complete user object with roles, designation, and client info
- **`saf_admin_clients`**: Array of client/tenant information
- **`saf_admin_profiles`**: Assigned profile configuration including home page URL
- **`saf_admin_token`**: JWT authentication token

## Testing

To test the navigation:

1. Start the backend server: `npm run dev` (from server root)
2. Start the frontend: `npm run dev` (from client/admin)
3. Login with valid credentials
4. Verify that you are redirected to the URL specified in `mnu_home_pg`
5. Check browser localStorage to confirm all data is saved correctly

## Notes

- The home page URL is dynamically determined by the backend
- Different users can have different home pages based on their assigned profiles
- The URL cleaning ensures compatibility with React Router's navigation
- If `mnu_home_pg` is not provided, the default `/dashboard` route is used











