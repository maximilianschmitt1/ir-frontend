'use strict';

var autoComplete = function($http, solrApi) {
	return {
		restrict: 'A',
		link: function($scope, element) {
			element.autocomplete({
				source: function(req, res) {
					solrApi.suggest(req.term).then(res);
				},
				// limit number of characters that are shown in list item
				response: function(event, ui) {
					ui = ui.content.map(function(result) {
						if (result.label.length < 56) {
							return;
						}

						result.label = result.label.substr(0, 56) + '...';
					});
				}
			});
		}
	};
};

module.exports = autoComplete;