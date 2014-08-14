'use strict';

var solrApi = function($http) {
	var apiUrl = 'http://localhost:8983/solr';

	var jsonp = function(url, options) {
		options = options || {};
		options.params = options.params || {};

		options.params['json.wrf'] = 'JSON_CALLBACK';
		options.params.wt = 'json';

		return $http.jsonp(url, options);
	};

	return {
		query: function(query) {
			return jsonp(apiUrl + '/collection1/select', { params: { q: query } })
				.then(function(data) {
					var results = [];

					data.data.response.docs.forEach(function(doc) {
						var title = doc.title ? doc.title[0] : 'Unbenanntes Dokument';
						var result = {
							title: title,
							url: doc.url,
							description: doc.content[0].substr(0, 300)
						};

						results.push(result);
					});

					return results;
				});
		},
		suggest: function(query) {
			return jsonp(apiUrl + '/suggest', {
					params: {
						'suggest.dictionary': 'mySuggester',
						'suggest': 'true',
						'suggest.build': 'true',
						'suggest.q': query
					}
				}).then(function(data) {
					var suggestionsResponse = data.data.suggest.mySuggester[query].suggestions;
					var suggestions = suggestionsResponse.map(function(suggestion) {
						return suggestion.term;
					});

					return suggestions;
				});
		}
	};
};

module.exports = solrApi;