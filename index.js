'use strict'

const ROOT_DIR = process.env.ROOT_DIR = __dirname;

var mongoose		= require('mongoose');
var ScrapeService 	= require(`${ROOT_DIR}/services/ScrapeService`);

require('dotenv').config();
require(`${ROOT_DIR}/config/mongoose`);
var logger = require(`${ROOT_DIR}/config/winston`);

logger.log('info', 'MLB SCRAPING BEGINNING');
ScrapeService.getGameOdds()
.then(() => {
	logger.log('info', 'Done and closing');
	process.exit(0);
})
.catch((err) => {
	logger.error(err);
	process.exit(1);
});
