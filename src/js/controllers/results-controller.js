'use strict';

var quickLinksIndex = {
	'grips': ['GRIPS', 'e-learning', 'elearning', 'g.r.i.p.s', 'e learning'],
	'lsf': [ 'vorlesungsverzeichnis', 'stundenplan', 'vorlesungen', 'veranstaltungen', 'kurse'],
	'k-laufwerk': ['k laufwerk', 'netstorage', 'kurslaufwerk', 'kurssoft', 'k drive','k-drive', 'laufwerk k', 'k server','kurs laufwerk', 'net storage' , 'klaufwerk', 'kdrive'],
	'mail': ['e-mail', 'email', 'group wise', 'uni mail',  'unimail', 'groupwise'],
	'flexnow': ['prüfungsergebnisse', 'noten', 'studentendaten', 'prüfungsanmeldung']
};

var ResultsController = function($scope, $stateParams, $state, solrApi) {
	$scope.searchText     = $stateParams.query;
	$scope.page           = $stateParams.page ? Math.max(parseInt($stateParams.page, 10), 1) : 1;

	$scope.resultsPerPage = 10;
	$scope.visiblePages   = 15;

	$scope.quickLinkSuggestion = getQuickLinkSuggestion($scope.searchText);

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

	function getQuickLinkSuggestion(searchText) {
		for (var quickLink in quickLinksIndex) {
			if (quickLink === searchText) {
				return quickLink;
			}

			var synonyms = quickLinksIndex[quickLink];

			for (var i = 0; i < synonyms.length; i++) {
				if (searchText === synonyms[i]) {
					return quickLink;
				}
			}
		}
	}
};

module.exports = ResultsController;