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
			query = query || {};
			query.defType = 'dismax';
			query.qf = 'title^10.0';
			return jsonp(apiUrl + '/collection1/select', { params: query })
				.then(function(data) {
					var results = [];

					var docs = data.data.response.docs;
					var highlighting = data.data.highlighting;
					var spellSuggestion = null;

					if (data.data.spellcheck && data.data.spellcheck.suggestions[1]) {
						spellSuggestion = data.data.spellcheck.suggestions[1].suggestion[0];
					}

					docs.forEach(function(doc) {
						var title = highlighting[doc.url].title[0] || 'Unbenanntes Dokument';
						var suffixIndex = title.indexOf(' - Universität Regensburg');
						title =  suffixIndex === -1 ? title : title.substr(0, suffixIndex);

						var description = highlighting[doc.url].content[0].trim();

						var result = {
							title: title,
							url: doc.url,
							description: description
						};

						results.push(result);
					});

					var numResults = data.data.response.numFound;
					if (numResults < 1 && !spellSuggestion && query.q.toLowerCase() !== 'florian meier') {
						spellSuggestion = 'florian meier';
					}

					return {
						numResults: data.data.response.numFound,
						results: results,
						spellSuggestion: spellSuggestion
					};
				});
		},

		suggest: function(query) {
			query = query.toLowerCase();
			var searchTerms = query.split(' ');
			var filterQuery = searchTerms.slice(0, searchTerms.length - 1).join(' ');
			var lastSearchTerm = searchTerms[searchTerms.length - 1];

			var params =  {
				'q': '*.*',
				'rows': 0,
				'facet': true,
				'facet.limit': 7 + searchTerms.length,
				'facet.field': 'title',
				'facet.prefix': lastSearchTerm
			};

			if (filterQuery) {
				params.fq = 'title:' + filterQuery;
			}

			return jsonp(apiUrl + '/collection1/select', {
					params: params
				}).then(function(data) {
					var suggestionsResponse = data.data.facet_counts.facet_fields.title;
					var suggestions = [];
					suggestionsResponse.forEach(function(suggestion) {
						if (typeof suggestion === 'number') {
							return;
						}

						if (searchTerms.indexOf(suggestion) === -1) {
							suggestions.push(filterQuery + ' ' + suggestion);
						}
					});

					return suggestions;
				});
		}
	};
};

module.exports = solrApi;