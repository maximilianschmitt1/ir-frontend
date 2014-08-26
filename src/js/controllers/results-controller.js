'use strict';

var ResultsController = function($scope, $stateParams, $state, solrApi) {
	$scope.searchText     = $stateParams.query;
	$scope.page           = $stateParams.page ? Math.max(parseInt($stateParams.page, 10), 1) : 1;

	$scope.resultsPerPage = 10;
	$scope.visiblePages   = 15;

	$scope.pagingStart = function() {
		return Math.max(0, $scope.page - 1 - Math.floor($scope.visiblePages / 2));
	};

	$scope.query = function(searchText) {
		$state.go($state.current.name, { query: searchText });
	};

	solrApi.query({
		start: ($scope.page - 1) * $scope.resultsPerPage,
		rows: $scope.resultsPerPage,
		q: $stateParams.query
	}).then(function(response) {
		$scope.numResults = parseInt(response.numResults, 10);
		$scope.results = response.results;
		$scope.spellSuggestion = response.spellSuggestion;
	});
};

module.exports = ResultsController;