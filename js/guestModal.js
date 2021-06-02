/** Elements */
const $guestForm = document.querySelector('#guest-form');
const $guestFormInput = $guestForm.querySelector('input');
const $guestFormButton = $guestForm.querySelector('button');
const $guestFormError = $guestForm.querySelector('.error');
const $guestModal = $('#guest-modal');

$(document).ready(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			if (!getCookie(domainName + '_guestId')) {
				/* Trigger geolocation permission */
				navigatorGeolocation((error, coords) => {});

				$guestModal.modal({
					backdrop: 'static',
					keyboard: false,
					show: true,
				});
			}
		} else {
			$guestModal.modal('hide');
		}
	});
});

/** Guest Modal Form Submit */
$guestForm.addEventListener('submit', (e) => {
	e.preventDefault();

	/** Check if geolocation was allowed */
	navigator.permissions.query({ name: 'geolocation' }).then((data) => {
		if (data.state === 'denied') {
			$guestFormError.innerHTML = 'Geolocation is not enabled. Please enable to use this site.';
		} else {
			/** Disable Button */
			$guestFormButton.setAttribute('disabled', 'disabled');

			const guestName = e.target.elements.guestName.value;

			/* Get source app URL params if exist */
			const queryString = window.location.search.substring(1);
			const parsedQs = parseQueryString(queryString);
			const appCode = typeof parsedQs.app !== 'undefined' ? parsedQs.app : 'GLOBAL';

			guestLogger(appCode, guestName, (error, data) => {
				$guestFormButton.removeAttribute('disabled');

				if (!error) {
					/** Enable Form */
					$guestFormInput.value = '';
					$guestModal.modal('hide');
				}
			});
		}
	});
});
