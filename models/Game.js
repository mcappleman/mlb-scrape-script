'use strict'

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var Team     = require('../models/Team');

var gameSchema = new Schema({
	date: 					Date,
	home_team: 				{ type: Schema.Types.ObjectId, ref: 'Team' },
	away_team: 				{ type: Schema.Types.ObjectId, ref: 'Team' },
	home_runs: 				Number,
	away_runs: 				Number,
	status: 				String,
	inning: 				Number,
	top_inning: 			Boolean,
	gd2_id: 				String,
	number_fire_favorite: 	{type: Schema.Types.ObjectId, ref: 'Team'},
	number_fire_odds: 		Number
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;