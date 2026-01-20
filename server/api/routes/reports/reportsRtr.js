var reportsRtr = require('express').Router();
var reportCtrl = require('../../modules/report/controllers/reportCtrl');

// Get reports with filters
reportsRtr.get('/get', reportCtrl.getReportsCtrl);

module.exports = reportsRtr;



