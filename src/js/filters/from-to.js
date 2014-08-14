'use strict';

var fromTo = function() {
	return function(input, offset, number) {
		offset = parseInt(offset, 10);
		number = parseInt(number, 10);
		input = input.slice(offset, offset + number);
		return input;
	};
};

module.exports = fromTo;