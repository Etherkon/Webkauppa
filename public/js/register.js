/**
 * TODO: 8.3 Register new user
 *       - Handle registration form submission 
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

const userName = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirmation = document.getElementById("passwordConfirmation");
const register = document.getElementById("btnRegister");

const nameEmpty = name.innerHTML;
const emailEmpty = email.innerHTML;
const passwordEmpty = password.innerHTML;
const passwordConfirmationEmpty = passwordConfirmation.innerHTML;

const user = {
	name: "",
	email: "",
	password: ""
};

register.addEventListener('click', function (event) {
	event.preventDefault();

	/*if (userName.value == "" || userName.value == undefined || !userName.validity ) {
		createNotification("Name is missing!", "notifications-container", false);
	}

	else if (email.value === "" || email.name == undefined || !email.validity ) {
		createNotification("Email is missing!", "notifications-container", false);
	}

	else if (password.value === "" ||
	password.value == undefined ||
	password.value.length < 10 ||
	!password.validity ) {
		createNotification("Fill in the password field correctly. Minimum length 10.", "notifications-container", false);
	}

	else if (passwordConfirmation.value === "" ||
	passwordConfirmation.value == undefined ||
	passwordConfirmation.value.length < 10 ||
	!passwordConfirmation.validity ) {
		createNotification("Fill in the password field correctly. Minimum length 10.", "notifications-container", false);
	}

	else */
	if (password.value !== passwordConfirmation.value) {
		createNotification("The passwords do not match", "notifications-container", false);
	}

	else {
		user.name = userName.value;
		user.email = email.value;
		user.password = password.value;

		postOrPutJSON("/api/register", "POST", user).then(res => {
			console.log(res.status);
			if (res.status == 201) {
				createNotification("Registeration was successful!", "notifications-container");

				userName.innerText = nameEmpty;
				email.innerText = emailEmpty;
				password.innerText = passwordEmpty;
				passwordConfirmation.innerText = passwordConfirmationEmpty;
			}
			else {
				res.text().then(text => {
					let errorText = JSON.parse(text).error;
					createNotification(errorText, "notifications-container", false);
				});
			}

		}).catch(err => {
			console.log(err);

		})
	}

}, false);
