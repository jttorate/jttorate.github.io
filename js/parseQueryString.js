parseQueryString = (query) => {
	var vars = query.split('&');
	var queryString = {};

	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		var key = decodeURIComponent(pair[0]);
		var value = decodeURIComponent(pair[1]);
		/* If first entry with this name */
		if (typeof queryString[key] === 'undefined') {
			queryString[key] = decodeURIComponent(value);
			/* If second entry with this name */
		} else if (typeof queryString[key] === 'string') {
			var arr = [queryString[key], decodeURIComponent(value)];
			queryString[key] = arr;
			/* If third or later entry with this name */
		} else {
			queryString[key].push(decodeURIComponent(value));
		}
	}

	return queryString;
};
