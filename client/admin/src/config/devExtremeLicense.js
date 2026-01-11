/**
 * DevExtreme License Configuration
 * 
 * To set up your DevExtreme license:
 * 1. Obtain your license key from DevExpress Download Manager or from C:\projects\APTIS
 * 2. Either:
 *    - Set the VITE_DX_LICENSE environment variable in .env file (recommended)
 *    - Or update the LICENSE_KEY constant below with your actual license key
 *    - Or place DevExpress_License.txt in %AppData%\DevExpress\ (Windows)
 * 
 * See DEVEXTREME_LICENSE_SETUP.md for detailed instructions
 */

// Option 1: Set license key directly (paste your license key here)
// Get this from C:\projects\APTIS or DevExpress Download Manager
// Format: Usually a long string like "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
export const LICENSE_KEY = '';

// Option 2: License key from environment variable (recommended)
// Set VITE_DX_LICENSE in your .env file in client/admin directory
export const getLicenseKey = () => {
  // Check environment variable first (recommended method)
  if (import.meta.env.VITE_DX_LICENSE) {
    const envKey = import.meta.env.VITE_DX_LICENSE.trim();
    if (envKey) {
      console.log('DevExtreme license found in environment variable');
      return envKey;
    }
  }
  
  // Return the constant if set (fallback method)
  if (LICENSE_KEY && LICENSE_KEY.trim()) {
    console.log('DevExtreme license found in config file');
    return LICENSE_KEY.trim();
  }
  
  // Return empty string if no license (will show evaluation message)
  console.warn('DevExtreme license key not found. Please set VITE_DX_LICENSE in .env or update LICENSE_KEY in this file.');
  return '';
};

