'use strict';

module.exports = function(app) {
	// Controllers
	app.controller('HomeController', require('./controllers/home-controller'));
	app.controller('ResultsController', require('./controllers/results-controller'));
	// Directives
	app.directive('autoComplete', require('./directives/auto-complete'));
	// Factorys
	app.factory('solrApi', require('./factories/solr-api'));
	// Filters
	app.filter('fromTo', require('./filters/from-to'));
	app.filter('range', require('./filters/range'));
};