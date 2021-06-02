navigatorGeolocation = (callback) => {
	/** Check if browser supported*/
	if (!navigator.geolocation) {
		callback('Geolocation is not supported by your browser.');
	}
	/* Get current position by browser geolocation */
	navigator.geolocation.getCurrentPosition((position) => {
		callback(null, {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		});
	});
};
