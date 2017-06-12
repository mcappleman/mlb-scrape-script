'use strict'

var mongoose		= require('mongoose');
var ScrapeService 	= require('./services/ScrapeService');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mlb_feed');

ScrapeService.getGameOdds()
.then(() => {
	return ScrapeService.getEloRating();
})
.then(() => {
	console.log('Done and closing');
	process.exit(0);
})
.catch((err) => {
	throw err;
	process.exit(1);
})