'use strict'

var cheerio 	= require('cheerio');
var request 	= require('request');
var GameService	= require('./GameService');

var now = new Date();
var numDays = 0;

const ABBREV_TRANSLATION = {
	'CHW': 'CWS'
}

module.exports = {
	getGameOdds,
	getEloRating
};

function getGameOdds() {

	var i = 0;

	return new Promise((resolve, reject) => {

		iter();

		function iter() {

			if (i >= numDays) {
				return resolve();
			}
		
			var currentDate = new Date();
			currentDate.setDate(now.getDate() + i);

			requestNumberFire(currentDate)
			.then(() => {
				i++;
				iter();
			})
			.catch((err) => {
				console.log('Done messed up', err);
				reject(err);
			});

		}

	});

}

function getEloRating() {

	return requestEloPage()
	.then(() => {

	})
	.catch((err) => {
		console.log('Error with get elo rating', err);
		throw err;
	});

}

function promisfy(url) {

	return new Promise((resolve, reject) => {

		request(url, (error, response, body) => {

			if (error) { reject(error) }

			console.log(body);

			resolve(body);

		});

	});

}

function requestEloPage() {

	var url = `https://projects.fivethirtyeight.com/2017-mlb-predictions/`;

	console.log(url);

	var req = {
		url: url,
		headers: {
			'Accept': 'text/html',
			'Accept-Language': 'en-US',
			'Referer': 'https://www.google.com/',
			'User-Agent': 'Mozilla/5.0'
		}
	}

	return promisfy(req)
	.then((body) => {

		return parseTeams(body);

	})
	.catch((err) => {
		console.log('error in request elo page', err);
		throw err;
	});

}

function requestNumberFire(date) {

	var url = `https://www.numberfire.com/mlb/games/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

	console.log(url);

	return promisfy(url)
	.then((body) => {

		return grabGames(date, body);

	})
	.catch((err) => {
		console.log(err);
		throw err;
	});

}

function grabGames(date, body) {

	var $ = cheerio.load(body);
	var promises = [];

	var gameScores = $('.grid__two-col--main.grid--1-2').find('.game-indiv__game-header__score');

	for (var key in gameScores) {

		var promise = new Promise((resolve, reject) => {

			if (typeof gameScores[key] === 'object') {

				var leftAbbrev = $(gameScores[key]).find('.team.team--left span.abbrev').text();
				var rightAbbrev = $(gameScores[key]).find('.team.team--right span.abbrev').text();

				var split = leftAbbrev.split('');
				if (split.length > 3) {
					return resolve();
				}

				var favorite = $(gameScores[key]).find('.win-probability-wrap .win-probability').hasClass('odds-right') ? rightAbbrev : leftAbbrev;
				var odds = $(gameScores[key]).find('.win-probability-wrap .win-probability h4').text().split('\n')[1];
				if (!odds) {
					return resolve();
				}
				odds = Number(odds.split(' ').pop().split('%')[0]);

				leftAbbrev = translateAbbrev(leftAbbrev);
				rightAbbrev = translateAbbrev(rightAbbrev);

				var game = {
					date,
					leftAbbrev,
					rightAbbrev,
					favorite,
					odds
				}

				console.log(`${date} ${leftAbbrev} v ${rightAbbrev} favorite: ${favorite} by ${odds}`);

				return GameService.updateOdds(game)
				.then((updated) => {
					return resolve();
				})
				.catch(reject);

			} 

			return resolve();

		});

		promises.push(promise);

	}

	return Promise.all(promises);

}

function parseTeams(body) {

	var promises = [];

	var $ = cheerio.load(body);
	console.log($.html());

	$('.team-row').each((i, elem) => {
		var promise = new Promise((resolve, reject) => {
			console.log(elem);

			return resolve();
		});
	});

	return Promise.all(promises);

}

function translateAbbrev(abbrev) {

	if (ABBREV_TRANSLATION[abbrev]) {
		return ABBREV_TRANSLATION[abbrev];
	}

	return abbrev;

}

