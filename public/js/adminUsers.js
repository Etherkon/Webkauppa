let container = document.getElementById("users-container");
let userIndex = 0;

getJSON("/api/users").then(users => {

    userUnit(users, 0);
	userIndex = 0;
});

function userUnit(users, uIndex) {
        let user = users[uIndex];

        // Getting the template
        let template = document.querySelector("#user-template").content.cloneNode(true);

        // Adding id to user section
        template.querySelector(".item-row").setAttribute("id", "section-" + user._id);

        // Template elements
        let nameElement = template.querySelector(".user-name");
        let emailElement = template.querySelector(".user-email");
        let roleElement = template.querySelector(".user-role");
        let btnModifyElement = template.querySelector(".modify-button");
        let btnDeleteElement = template.querySelector(".delete-button");

        // Changing values in template
        nameElement.innerHTML = user.name;
        nameElement.setAttribute("id", "name-" + user._id);

        emailElement.innerHTML = user.email;
        emailElement.setAttribute("id", "email-" + user._id);

        roleElement.innerHTML = user.role;
        roleElement.setAttribute("id", "role-" + user._id);

        btnModifyElement.setAttribute("id", "modify-" + user._id);
        btnDeleteElement.setAttribute("id", "delete-" + user._id);

        // Adding user to HTML
        container.append(template);

        // 8.5 Implemetation for button click events
        container.querySelector("#modify-" + user._id).addEventListener('click', event => {
            event.preventDefault();

            let form_template = document.querySelector("#form-template").content.cloneNode(true);

            // Getting the user data for user to modify
            getJSON("/api/users/" + user._id).then(u => {

                // Template elements
                let h2 = form_template.querySelector("h2");
                let id_input = form_template.getElementById("id-input");
                let name_input = form_template.getElementById("name-input");
                let email_input = form_template.getElementById("email-input");
                let role_input = form_template.getElementById("role-input");

                h2.innerHTML = h2.innerHTML.replace("{User Name}", u.name);

                id_input.value = u._id;
                name_input.value = u.name;
                email_input.value = u.email;
                role_input.value = u.role;
                role_input.disabled = false;

                // Showing up the modifying UI
                document.getElementById("modify-user").append(form_template);

                // When update is clicked
                document.querySelector("#update-button").addEventListener('click', event => {
                    event.preventDefault();

                    try {
                        // Remove the modifying UI
                        document.querySelector("#edit-user-form").remove();
                    }
                    catch (err) {

                    }

                    let new_user_role = {
                        role: role_input.value
                    };

                    postOrPutJSON("/api/users/" + u._id, 'PUT', new_user_role).then(res => {

                        if (res.status == 200) {
                            res.text().then(text => {
                                let json = JSON.parse(text);

                                // Update the value to the user list
                                document.getElementById("role-" + json._id).innerText = json.role;
                                // Remove user from the list
                                createNotification("Updated user " + json.name, "notifications-container");
                            });
                        } else {
                            console.log("Role change failed");
                        }

                    });
                });
            });
        });

        container.querySelector("#delete-" + user._id).addEventListener('click', event => {
            event.preventDefault();

            try {
                // Remove the modifying UI
                document.querySelector("#edit-user-form").remove();
            }
            catch (err) {

            }

            deleteResourse("/api/users/" + user._id).then(res => {

                // Deleting successful
                if (res.status == 200) {
                    res.text().then(text => {
                        let json = JSON.parse(text);

                        // Remove user from the list
                        document.querySelector("#section-" + json._id).remove();
                        createNotification("Deleted user " + json.name, "notifications-container");
                    });
                }
                else {
                    // Deleting failed
                    res.text().then(text => {
                        // Printing the error text
                        let errorText = JSON.parse(text).error;
                        createNotification(errorText, "notifications-container", false);
                    });
                }

            });

        });
		userIndex += 1;
		console.log(userIndex);
		if(userIndex < users.length) { userUnit(users, userIndex); }

 }
