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
			return jsonp(apiUrl + '/collection1/select', { params: query })
				.then(function(data) {
					var results = [];

					var docs = data.data.response.docs;
					var highlighting = data.data.highlighting;

					docs.forEach(function(doc) {
						var title = highlighting[doc.url].title[0] || 'Unbenanntes Dokument';
						var suffixIndex = title.indexOf(' - Universität Regensburg');
						title =  suffixIndex === -1 ? title : title.substr(0, suffixIndex);

						var result = {
							title: title,
							url: doc.url,
							description: highlighting[doc.url].content[0].trim()
						};

						results.push(result);
					});

					return {
						numResults: data.data.response.numFound,
						results: results
					};
				});
		},
		suggest: function(query) {
			return jsonp(apiUrl + '/collection1/select', {
					params: {
						'q': '*.*',
						'rows': 0,
						'facet': true,
						'facet.limit': 7,
						'facet.field': 'title',
						'facet.prefix': query
					}
				}).then(function(data) {
					var suggestionsResponse = data.data.facet_counts.facet_fields.title;
					var suggestions = [];
					suggestionsResponse.forEach(function(suggestion) {
						if (typeof suggestion === 'number') {
							return;
						}

						suggestions.push(suggestion);
					});

					return suggestions;
				});
		}
	};
};

module.exports = solrApi;