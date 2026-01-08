import CryptoJS from 'crypto-js';

/**
 * Encrypt password using SHA1 (simplified for SAF)
 * @param {string} plainPassword - Plain text password
 * @returns {string} SHA1 hashed password
 */
export const encryptPassword = (plainPassword) => {
  try {
    // SHA1 hash of plain password
    const sha1Hash = CryptoJS.SHA1(plainPassword).toString();
    return sha1Hash;
  } catch (error) {
    console.error('Password encryption error:', error);
    throw new Error('Failed to encrypt password');
  }
};

/**
 * Generate random salt key (for testing purposes)
 * @param {number} length - Length of salt key
 * @returns {string} Random salt key
 */
export const generateSaltKey = (length = 16) => {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

