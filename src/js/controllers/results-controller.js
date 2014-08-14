'use strict';

var ResultsController = function($scope, $stateParams, $state, solrApi) {
	$scope.searchText = $stateParams.query;

	$scope.query = function(searchText) {
		$state.go($state.current.name, { query: searchText });
	};

	solrApi.query($stateParams.query).then(function(results) {
		$scope.results = results;
	});
};

module.exports = ResultsController;