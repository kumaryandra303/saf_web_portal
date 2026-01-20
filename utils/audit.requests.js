// Audit requests utility
const fs = require('fs');
const path = require('path');

module.exports = {
    auditAllUrls: function(req, res, type, appName) {
        // Audit logging - can be extended
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };
        
        // Log to console for now
        console.log('Audit:', logEntry);
    },

    isMobile: function(req, res, callback) {
        const userAgent = req.get('user-agent') || '';
        const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
        callback(null, isMobile);
    }
};















