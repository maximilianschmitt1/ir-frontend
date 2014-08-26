'use strict';

var autoComplete = function($http, solrApi) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.autocomplete({
				source: function(req, res) {
					solrApi.suggest(req.term).then(res);
				},
				// limit number of characters that are shown in list item
				response: function(e, ui) {
					ui = ui.content.map(function(result) {
						if (result.label.length < 56) {
							return;
						}

						result.label = result.label.substr(0, 56) + '...';
					});
				},

				select: function(e, ui) {
					element.val(ui.item.value);
					element.trigger('change');
					scope.$eval(attrs.autoComplete);
				}
			});
		}
	};
};

module.exports = autoComplete;