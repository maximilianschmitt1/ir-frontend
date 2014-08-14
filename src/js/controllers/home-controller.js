'use strict';

var HomeController = function($scope, $state) {
	$scope.search = function(searchText) {
		$state.go('results', { query: searchText });
	};
};

module.exports = HomeController;