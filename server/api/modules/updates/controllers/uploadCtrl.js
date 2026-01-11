// File Upload Controller for Updates Images
var multer = require('multer');
var path = require('path');
var fs = require('fs');

// Create uploads directory if it doesn't exist
var uploadsDir = path.join(appRoot, 'public', 'docs', 'updates');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-random-originalname
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        var ext = path.extname(file.originalname);
        var name = path.basename(file.originalname, ext);
        cb(null, 'update-' + uniqueSuffix + ext);
    }
});

// File filter - only images
var fileFilter = function (req, file, cb) {
    var allowedTypes = /jpeg|jpg|png|gif|webp/;
    var extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    var mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Configure multer
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Upload handler for 3 images
exports.uploadUpdateImages = upload.fields([
    { name: 'img_1', maxCount: 1 },
    { name: 'img_2', maxCount: 1 },
    { name: 'img_3', maxCount: 1 }
]);

// Get file path relative to public folder
exports.getFilePath = function (filename) {
    if (!filename) return null;
    // Return path that will be served by express.static
    return '/docs/updates/' + filename;
};

