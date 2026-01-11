var keypeopleRtr = require('express').Router();
var keypeopleCtrl = require('../../modules/keypeople/controllers/keypeopleCtrl');

// Get all key people route
keypeopleRtr.get('/list', keypeopleCtrl.getKeyPeopleCtrl);

// Get top key people for dashboard route
keypeopleRtr.get('/top', keypeopleCtrl.getTopKeyPeopleCtrl);

module.exports = keypeopleRtr;

