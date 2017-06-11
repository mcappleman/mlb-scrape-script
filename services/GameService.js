'use strict'

var Game		= require('../models/Game');
var Team		= require('../models/Team');

module.exports = {
	updateOdds
}

function updateOdds(game) {

	var leftTeam, rightTeam;

	return Team.findOne({ abbrev: game.leftAbbrev })
	.then((team) => {

		leftTeam = team;

		return Team.findOne({ abbrev: game.rightAbbrev });

	})
	.then((team) => {

		rightTeam = team;

		var favored = team;

		if (game.favorite === game.leftAbbrev) {
			favored = game.leftAbbrev;
		}

		var startDate = new Date(game.date);
		startDate.setHours(0);
		var endDate = new Date(game.date);
		endDate.setHours(23);
		endDate.setMinutes(59);

		console.log(`Updating Game: ${leftTeam.abbrev} @ ${rightTeam.abbrev} on ${game.date}\n`);

		return Game.update({ home_team: rightTeam._id, away_team: leftTeam._id, date: { $gt: startDate, $lt: endDate } }, { $set: { number_fire_favorite: favored._id, number_fire_odds: game.odds } });

	})
	.catch((err) => {
		console.log('Error Updating Game Service', err);
		console.log(game);
		console.log(leftTeam);
		console.log(rightTeam);
		reject(err);
	});

}