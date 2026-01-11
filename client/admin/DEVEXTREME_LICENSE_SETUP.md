# DevExtreme License Setup Guide

This guide explains how to configure your DevExtreme license to remove the evaluation message.

## Method 1: Environment Variable (Recommended)

1. Create a `.env` file in the `client/admin` directory (if it doesn't exist)
2. Add your DevExtreme license key:
   ```
   VITE_DX_LICENSE=your_license_key_here
   ```
3. Restart the development server

## Method 2: License File

1. Obtain your `DevExpress_License.txt` file from DevExpress Download Manager
2. Place it in one of these locations:
   - **Windows**: `%AppData%\DevExpress\`
   - **macOS**: `$HOME/Library/Application Support/DevExpress/`
   - **Linux**: `$HOME/.config/DevExpress/`
3. Or set the `DevExpress_LicensePath` environment variable to point to your license file directory

## Method 3: Direct Configuration

1. Edit `client/admin/src/config/devExtremeLicense.js`
2. Replace `'YOUR_LICENSE_KEY_HERE'` with your actual license key:
   ```javascript
   export const LICENSE_KEY = 'your_actual_license_key';
   ```

## Obtaining Your License Key

1. Log in to [DevExpress Download Manager](https://www.devexpress.com/ClientCenter/)
2. Navigate to your licensed products
3. Download the `DevExpress_License.txt` file
4. Extract the license key from the file

## Verification

After setting up the license:
1. Start the development server: `npm run dev`
2. Check the browser console - you should see: "DevExtreme license registered successfully"
3. The evaluation message should no longer appear

## Technical Details

The license is registered in `src/main.jsx` using:
```javascript
import config from 'devextreme/core/config'
config({ licenseKey: 'your_license_key' })
```

This is the correct method for DevExtreme v25.2.3

## Notes

- The `.env` file is already in `.gitignore` to prevent committing your license key
- The license is registered in `src/main.jsx` before the app renders
- If no license is found, the app will run in evaluation mode with the evaluation message

## Troubleshooting

### License not working?
1. Verify the license key is correct (no extra spaces or quotes)
2. Ensure the `.env` file is in the `client/admin` directory
3. Restart the development server after changing the license
4. Check the browser console for any error messages

### Still seeing evaluation message?
- The CSS rules in `index.css` and component CSS files should hide the message
- If it still appears, check that the CSS rules are properly loaded

