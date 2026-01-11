# How to Get DevExtreme License from APTIS Project

## Method 1: Check APTIS Environment Variables

1. Navigate to `C:\projects\APTIS\client\admin`
2. Check if there's a `.env` file:
   ```bash
   cd C:\projects\APTIS\client\admin
   type .env
   ```
3. Look for `VITE_DX_LICENSE` or similar environment variable

## Method 2: Check APTIS Configuration Files

1. Check `C:\projects\APTIS\client\admin\src\config\` for license configuration
2. Check `C:\projects\APTIS\client\admin\vite.config.ts` for license settings
3. Check `C:\projects\APTIS\client\admin\src\main.tsx` or `main.ts` for license registration

## Method 3: Check Windows AppData (Default DevExpress Location)

1. Open File Explorer
2. Navigate to: `%AppData%\DevExpress\`
3. Look for `DevExpress_License.txt` file
4. Open the file and copy the license key

## Method 4: Check DevExpress Download Manager

1. Open DevExpress Download Manager
2. Navigate to your licensed products
3. Download `DevExpress_License.txt`
4. Extract the license key from the file

## Method 5: Check APTIS Source Code

Search for license key in APTIS codebase:
```bash
cd C:\projects\APTIS
findstr /s /i "license" *.js *.jsx *.ts *.tsx *.json
```

## After Finding the License Key

Once you have the license key, add it to this project:

### Option A: Environment Variable (Recommended)
1. Create or edit `.env` file in `client/admin/` directory
2. Add:
   ```
   VITE_DX_LICENSE=your_license_key_here
   ```
3. Restart the development server

### Option B: Direct Configuration
1. Edit `client/admin/src/config/devExtremeLicense.js`
2. Replace empty string in `LICENSE_KEY`:
   ```javascript
   export const LICENSE_KEY = 'your_license_key_here';
   ```
3. Restart the development server

## Verify License is Working

1. Start the admin portal: `npm run dev`
2. Check browser console - should see: "✅ DevExtreme license registered successfully"
3. The orange evaluation banner should NOT appear
4. If banner still appears, the CSS rules will hide it automatically

