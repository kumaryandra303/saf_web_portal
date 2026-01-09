var adminRtr = require('express').Router();
var adminCtrl = require('../../modules/admin/controllers/adminCtrl');

// Districts route - should come first
adminRtr.get('/get/districts', adminCtrl.getDistrictsCtrl);

// Mandals routes - accepts optional district_id parameter
adminRtr.get('/get/mandals', adminCtrl.getMandalsCtrl);
adminRtr.get('/get/mandals/:district_id', adminCtrl.getMandalsCtrl);

module.exports = adminRtr;

