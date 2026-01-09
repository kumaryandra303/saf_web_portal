var safRtr = require('express').Router();
var safCtrl = require('../../modules/saf/controllers/safCtrl');

// Membership submission route
safRtr.post('/membership/submit', safCtrl.submitMembershipCtrl);

// Get members list route
safRtr.get('/members/list', safCtrl.getMembersListCtrl);

module.exports = safRtr;

