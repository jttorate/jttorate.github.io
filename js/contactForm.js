/** Elements */
const $contactMeForm = document.querySelector('#contact-me-form');
const $contactMeFormInput = document.querySelectorAll('input[type="text"]');
const $contactMeFormTextarea = $contactMeForm.querySelector('textarea');
const $contactMeFormButton = $guestForm.querySelector('button');

/** Contact Me Form Submit */
$contactMeForm.addEventListener('submit', (e) => {
	e.preventDefault();
	/** Disable Button */
	$contactMeFormButton.setAttribute('disabled', 'disabled');

	contactUsForm(
		{
			firstName: e.target.elements.firstName.value,
			lastName: e.target.elements.lastName.value,
			email: e.target.elements.email.value,
			contactNumber: e.target.elements.contactNumber.value,
			message: e.target.elements.message.value,
		},
		(error, data) => {
			$contactMeFormButton.removeAttribute('disabled');

			if (!error) {
				/** Enable Form */
				for (var i = 0; i < $contactMeFormInput.length; i++) {
					$contactMeFormInput[i].value = '';
				}
				$contactMeFormTextarea.value = '';
			}
		}
	);
});
