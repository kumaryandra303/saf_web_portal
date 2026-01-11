var safRtr = require('express').Router();
var safCtrl = require('../../modules/saf/controllers/safCtrl');

// Membership submission route
safRtr.post('/membership/submit', safCtrl.submitMembershipCtrl);

// Get members list route
safRtr.get('/members/list', safCtrl.getMembersListCtrl);

// Admin register member route
safRtr.post('/admin/register-member', safCtrl.adminRegisterMemberCtrl);

module.exports = safRtr;

