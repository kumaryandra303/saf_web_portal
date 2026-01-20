var dashboardRtr = require('express').Router();
var dashboardCtrl = require('../../modules/dashboard/controllers/dashboardCtrl');

// Dashboard statistics route
dashboardRtr.get('/stats', dashboardCtrl.getDashboardStatsCtrl);

// Top members route
dashboardRtr.get('/top-members', dashboardCtrl.getTopMembersCtrl);

// District-wise statistics route
dashboardRtr.get('/district-wise', dashboardCtrl.getDistrictWiseStatsCtrl);

module.exports = dashboardRtr;






