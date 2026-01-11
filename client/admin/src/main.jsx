import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { getLicenseKey } from './config/devExtremeLicense.js'

// Import DevExtreme config for license registration
import config from 'devextreme/core/config'

// Register DevExtreme License
const licenseKey = getLicenseKey()
if (licenseKey) {
  try {
    // Register the license using DevExtreme config
    config({ licenseKey: licenseKey })
    console.log('✅ DevExtreme license registered successfully')
    
    // Also try to hide evaluation message programmatically as a fallback
    setTimeout(() => {
      // Hide any evaluation messages that might appear
      const hideEvaluationMessage = () => {
        const selectors = [
          '.dx-license-message',
          '.dx-license-message-container',
          '.dx-license-message-wrapper',
          '[class*="dx-license"]',
          '[class*="license-message"]',
          '[id*="license"]',
          '[data-dx-license]',
          'div:has-text("evaluation")',
          'div:has-text("DevExpress")',
          'div:has-text("register")',
          'div:has-text("purchase")'
        ];
        
        selectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              if (el && (el.textContent?.includes('evaluation') || 
                         el.textContent?.includes('license') ||
                         el.textContent?.includes('DevExpress'))) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                el.style.height = '0';
                el.style.width = '0';
                el.style.overflow = 'hidden';
                el.style.position = 'absolute';
                el.style.left = '-9999px';
              }
            });
          } catch (e) {
            // Ignore selector errors
          }
        });
      };
      
      // Run immediately and set up observer
      hideEvaluationMessage();
      
      // Watch for dynamically added elements
      const observer = new MutationObserver(hideEvaluationMessage);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Clean up observer after 10 seconds
      setTimeout(() => observer.disconnect(), 10000);
    }, 100);
  } catch (error) {
    console.warn('❌ DevExtreme license registration failed:', error)
  }
} else {
  console.warn('⚠️ DevExtreme license key not found. Running in evaluation mode.')
  console.info('📝 To register a license:')
  console.info('   1. Get license key from C:\\projects\\APTIS or DevExpress Download Manager')
  console.info('   2. Set VITE_DX_LICENSE in client/admin/.env file, OR')
  console.info('   3. Update LICENSE_KEY in client/admin/src/config/devExtremeLicense.js')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)





