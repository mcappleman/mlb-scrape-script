'use strict'

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var teamSchema = new Schema({
	name: 	String,
	city: 	String,
	abbrev: String
});

var Team = mongoose.model('Team', teamSchema)

module.exports = Team;