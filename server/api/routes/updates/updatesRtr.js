var updatesRtr = require('express').Router();
var updatesCtrl = require('../../modules/updates/controllers/updatesCtrl');
var uploadCtrl = require('../../modules/updates/controllers/uploadCtrl');

// Get updates list with filters
updatesRtr.get('/list', updatesCtrl.getUpdatesListCtrl);

// Get available years for filter
updatesRtr.get('/years', updatesCtrl.getAvailableYearsCtrl);

// Get single update by ID
updatesRtr.get('/:update_id', updatesCtrl.getUpdateByIdCtrl);

// Create new update with image uploads
updatesRtr.post('/create', uploadCtrl.uploadUpdateImages, function(req, res, next) {
    // Log all incoming data
    console.log('=== MIDDLEWARE: Processing uploaded files ===');
    console.log('req.body (before processing):', req.body);
    console.log('req.files:', req.files);
    
    // Process uploaded files and add paths to req.body
    if (req.files) {
        if (req.files.img_1 && req.files.img_1[0]) {
            req.body.img_1_pth = uploadCtrl.getFilePath(req.files.img_1[0].filename);
        }
        if (req.files.img_2 && req.files.img_2[0]) {
            req.body.img_2_pth = uploadCtrl.getFilePath(req.files.img_2[0].filename);
        }
        if (req.files.img_3 && req.files.img_3[0]) {
            req.body.img_3_pth = uploadCtrl.getFilePath(req.files.img_3[0].filename);
        }
    }
    
    // Log after processing
    console.log('req.body (after processing):', req.body);
    next();
}, updatesCtrl.createUpdateCtrl);

// Update existing update with image uploads
updatesRtr.put('/:update_id', uploadCtrl.uploadUpdateImages, function(req, res, next) {
    // Process uploaded files and add paths to req.body
    if (req.files) {
        if (req.files.img_1 && req.files.img_1[0]) {
            req.body.img_1_pth = uploadCtrl.getFilePath(req.files.img_1[0].filename);
        }
        if (req.files.img_2 && req.files.img_2[0]) {
            req.body.img_2_pth = uploadCtrl.getFilePath(req.files.img_2[0].filename);
        }
        if (req.files.img_3 && req.files.img_3[0]) {
            req.body.img_3_pth = uploadCtrl.getFilePath(req.files.img_3[0].filename);
        }
    }
    next();
}, updatesCtrl.updateUpdateCtrl);

// Delete update
updatesRtr.delete('/:update_id', updatesCtrl.deleteUpdateCtrl);

module.exports = updatesRtr;

