// File Upload Controller for Funds Receipt Images
var multer = require('multer');
var path = require('path');
var fs = require('fs');

// Ensure uploads directory exists
var uploadDir = path.join(appRoot, 'public', 'docs', 'funds');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        var ext = path.extname(file.originalname);
        cb(null, 'fund-receipt-' + uniqueSuffix + ext);
    }
});

// File filter - only images
var fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Configure multer - this will parse both files and text fields from FormData
var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware for single image upload (receipt)
// Note: multer.single() automatically parses both the file field AND all text fields from FormData
exports.uploadFundReceipt = upload.single('receipt_image');

// Get file path for serving
exports.getFilePath = function (filename) {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    return '/docs/funds/' + filename;
};

module.exports = exports;

