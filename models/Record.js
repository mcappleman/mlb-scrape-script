'use strict'

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var Team     = require('./Team');

var recordSchema = new Schema({
	team: 			{ type: Schema.Types.ObjectId, ref: 'Team' },
	wins: 			Number,
	losses: 		Number,
	year: 			Number,
	win_percent: 	Number
});

var Record = mongoose.model('Record', recordSchema)

module.exports = Record;