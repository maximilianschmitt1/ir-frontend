'use strict';

var quickLinksIndex = {
	'grips': ['GRIPS', 'e-learning', 'elearning', 'g.r.i.p.s', 'e learning'],
	'lsf': [ 'vorlesungsverzeichnis', 'stundenplan', 'vorlesungen', 'veranstaltungen', 'kurse'],
	'k-laufwerk': ['k laufwerk', 'netstorage', 'kurslaufwerk', 'kurssoft', 'k drive','k-drive', 'laufwerk k', 'k server','kurs laufwerk', 'net storage' , 'klaufwerk', 'kdrive'],
	'mail': ['e-mail', 'email', 'group wise', 'uni mail',  'unimail', 'groupwise'],
	'flexnow': ['flex now', 'flex-now', 'prüfungsergebnisse', 'noten', 'studentendaten', 'prüfungsanmeldung']
};

var ResultsController = function($scope, $stateParams, $state, solrApi) {
	$scope.searchText     = $stateParams.query;
	$scope.page           = $stateParams.page ? Math.max(parseInt($stateParams.page, 10), 1) : 1;

	if ($scope.searchText === 'wobble') {
		var elements = angular.element('*').not('div').not('body').not('html').addClass('animated').addClass('wobble');
		setTimeout(function() {
			elements.removeClass('animated').removeClass('wobble');
		}, 1000);
	}

	if ($scope.searchText === 'boom') {
		var elements = angular.element('*').not('div').not('body').not('html').addClass('animated').addClass('boom');
		setTimeout(function() {
			elements.removeClass('animated').removeClass('boom');
		}, 1000);
	}

	if ($scope.searchText === 'florian meier') {
		angular.element('.logo').attr('src', '../images/logo-meier.png');
	}

	if ($scope.searchText === 'wolff' || $scope.searchText === 'christian wolff') {
		angular.element('.logo').attr('src', '../images/logo-wolff.png');
	}

	$scope.resultsPerPage = 10;
	$scope.visiblePages   = 15;

	$scope.quickLinkSuggestion = getQuickLinkSuggestion($scope.searchText);

	$scope.pagingStart = function() {
		return Math.max(0, $scope.page - 1 - Math.floor($scope.visiblePages / 2));
	};

	$scope.query = function(searchText) {
		$state.go($state.current.name, { query: searchText, page: 1 });
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
		searchText = searchText.toLowerCase();

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