'use strict';

var range = function() {
	return function(input, total) {
		total = Math.ceil(parseFloat(total, 10));

		if (total === 0) {
			return input;
		}

		for (var i = 0; i < total; i++) {
			input.push(i);
		}

		return input;
	};
};

module.exports = range;