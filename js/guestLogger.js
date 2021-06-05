const loggerApiEndpoint = 'https://jt-nodejs-jttorate-api.herokuapp.com';
const domainName = 'jttorate.info';

guestLogger = (appCode, guestName, guestMsg, callback) => {
	/* CORS Anywhere */
	$.ajaxPrefilter(function (options) {
		if (options.crossDomain && jQuery.support.cors) {
			const http = window.location.protocol === 'http:' ? 'http:' : 'https:';
			options.url = http + '//jt-cors-anywhere.herokuapp.com/' + options.url;
		}
	});

	fetch('https://ipapi.co/json/')
		.then(function (response) {
			return response.json();
		})
		.then(function ({ ip, city, region, country, country_name, continent_code, timezone, org }) {
			/* Get current position by browser geolocation */
			navigatorGeolocation((error, coords) => {
				/** Data set */
				const guestDataSet = `app_code=${appCode}&name=${guestName}&message=${guestMsg}&ip_address=${ip}&city=${city}&country=${country}&latitude=${coords.latitude}&longitude=${coords.longitude}&timezone=${timezone}&network=${org}`;

				$.ajax({
					type: 'POST',
					url: loggerApiEndpoint + '/guests?' + guestDataSet,
					contentType: 'application/json',
					dataType: 'json',
					success: function (data) {
						/** Set cookie 1 hour expiration  */
						setCookie(domainName + '_guestId', data.guest._id, 0.04167);
						callback(null, true);
					},
					error: function (data) {
						callback(data);
					},
				});
			});
		});
};
