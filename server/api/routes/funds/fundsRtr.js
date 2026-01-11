var fundsRtr = require('express').Router();
var fundsCtrl = require('../../modules/funds/controllers/fundsCtrl');
var uploadFundCtrl = require('../../modules/funds/controllers/uploadFundCtrl');

// Get funds list route
fundsRtr.get('/list', fundsCtrl.getFundsListCtrl);

// Get total funds route
fundsRtr.get('/total', fundsCtrl.getTotalFundsCtrl);

// Get fund by ID route
fundsRtr.get('/:fund_id', fundsCtrl.getFundByIdCtrl);

// Create fund route (with image upload)
fundsRtr.post('/create', uploadFundCtrl.uploadFundReceipt, function (req, res, next) {
    // Log all incoming data for debugging
    console.log('=== MIDDLEWARE: Processing fund donation ===');
    console.log('req.body (after multer):', req.body);
    console.log('req.file:', req.file);
    
    // Add receipt image path to request body if uploaded
    if (req.file) {
        req.body.receipt_image_path = uploadFundCtrl.getFilePath(req.file.filename);
        console.log('Receipt image path added:', req.body.receipt_image_path);
    }
    
    console.log('req.body (final):', req.body);
    next();
}, fundsCtrl.createFundCtrl);

// Update fund route (with image upload)
fundsRtr.put('/:fund_id', uploadFundCtrl.uploadFundReceipt, function (req, res, next) {
    // Log all incoming data for debugging
    console.log('=== MIDDLEWARE: Updating fund donation ===');
    console.log('req.body (after multer):', req.body);
    console.log('req.file:', req.file);
    
    // Add receipt image path to request body if uploaded
    if (req.file) {
        req.body.receipt_image_path = uploadFundCtrl.getFilePath(req.file.filename);
        console.log('Receipt image path added:', req.body.receipt_image_path);
    }
    
    console.log('req.body (final):', req.body);
    next();
}, fundsCtrl.updateFundCtrl);

// Delete fund route
fundsRtr.delete('/:fund_id', fundsCtrl.deleteFundCtrl);

module.exports = fundsRtr;

