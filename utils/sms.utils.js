// SMS utility
const crypto = require('crypto');

module.exports = {
    TOTP: function() {
        // Generate a 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    sendSMS: function(mobile, message, callback) {
        // SMS implementation - integrate with your SMS provider
        console.log(`Sending SMS to ${mobile}: ${message}`);
        if (callback) {
            callback(null, { success: true });
        }
    }
};










