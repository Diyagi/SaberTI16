import * as dbUser from "../../soupabase/user.js";

let userData;

export async function init() {
	const editForm = document.querySelector("#editUserForm");
	userData = await loadUserData();
    populateInputs();

	editForm.addEventListener("submit", onFormSubmit);
}

async function loadUserData() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const userId = urlParams.get("userId");

	const { data, error } = await dbUser.getUser(userId);
    return data;
}

function populateInputs() {
	const emailInput = document.querySelector("#email");
	const usernameInput = document.querySelector("#username");
	const fullnameInput = document.querySelector("#fullName");
	const roleSelect = document.querySelector("#userRole");
    const userIdText = document.querySelector("#userId");

    userIdText.textContent = `ID do Usuario: ${userData.user.id}`;
	emailInput.value = userData.user.email;
	usernameInput.value = userData.user.profile.username;
	fullnameInput.value = userData.user.profile.full_name;
	roleSelect.value = userData.user.profile.user_role;
}

async function onFormSubmit(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const data = Object.fromEntries(formData.entries());

    const newData = {
        email: data.email,
        username: data.username,
        full_name: data.fullName,
        user_role: data.userRole
    }

    if (data.password) {
        newData.password = data.password;
    }

    const { _, error} = await dbUser.updateUser(userData.user.id, newData);

    if (error) {
        console.log(error)
        alert("Erro");
        return;
    }

    alert("Usuario Atualizado!");
}
