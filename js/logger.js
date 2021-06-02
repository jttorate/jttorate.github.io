/** Check if browser supported*/
if (!navigator.geolocation) {
	alert('Geolocation is not supported by your browser.');
}

const loggerApiEndpoint = 'https://jt-nodejs-jttorate-api.herokuapp.com';
const domainName = 'jttorate.info';

// if (!getCookie(domainName + '_guestId')) {}

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
		navigator.geolocation.getCurrentPosition((position) => {
			/* Get source app URL params if exist */
			const queryString = window.location.search.substring(1);
			const parsedQs = parseQueryString(queryString);

			const appCode = typeof parsedQs.app !== 'undefined' ? parsedQs.app : 'GLOBAL';
			const guestName = '';
			const guestDataSet = `app_code=${appCode}&name=${guestName}&ip_address=${ip}&city=${city}&country=${country}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&timezone=${timezone}&network=${org}`;

			$.ajax({
				type: 'POST',
				url: loggerApiEndpoint + '/guests?' + guestDataSet,
				contentType: 'application/json',
				dataType: 'json',
				success: function (data) {
					setCookie(domainName + '_guestId', data.guest._id, 1);
				},
				error: function (data) {
					console.log(data);
				},
			});
		});
	});
