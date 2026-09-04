import * as dbUser from "../../soupabase/user.js";
import * as formFeedback from "../../../../components/formFeedback.js"

let editMode = false;
let userData;

let userForm;
let submitBtn;

let emailInput;
let usernameInput;
let fullnameInput;
let roleSelect;
let userIdText;
let passwordInput;
let rePasswordInput;

let lastVerifiedEmail = null;
let lastVerifiedUsername = null;

export async function init() {
    const currentPath = window.location.pathname;
    editMode = currentPath.includes("users/edit");
    userForm = document.querySelector("#userForm");
    submitBtn = userForm.querySelector('button[type="submit"]');
    lastVerifiedEmail = null;
    lastVerifiedUsername = null;
    submitBtn.disabled = true;
    
    emailInput = document.querySelector("#email");
    usernameInput = document.querySelector("#username");
    fullnameInput = document.querySelector("#fullName");
    roleSelect = document.querySelector("#userRole");
    userIdText = document.querySelector("#userId");
    passwordInput = document.querySelector("#password");
    rePasswordInput = document.querySelector("#passwordConfirm");
    passwordInput.required = !editMode;
    rePasswordInput.required = !editMode;
    
    emailInput.addEventListener('blur', validateForm);
    usernameInput.addEventListener('blur', validateForm);
    fullnameInput.addEventListener('blur', validateForm);
    roleSelect.addEventListener('blur', validateForm);
    passwordInput.addEventListener('blur', validateForm);
    rePasswordInput.addEventListener('blur', validateForm);
    roleSelect.addEventListener('change', validateForm);
    
    userForm.addEventListener("submit", onFormSubmit);
    
    await populateRoleSelect();
    
    if (editMode) {
        await loadUserData();
        submitBtn.innerHTML = `<i class="bi bi-check-lg"></i> Salvar Alterações`
    } else {
        submitBtn.innerHTML = `<i class="bi bi-check-lg"></i> Criar Usuario`
    }

    await validateForm();
}

async function loadUserData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get("userId");
    
    const { data, error } = await dbUser.getUser(userId);
    userData = {...data.user};
    
    userIdText.textContent = `ID do Usuario: ${userData.id}`;
    emailInput.value = userData.email;
    usernameInput.value = userData.profile.username;
    fullnameInput.value = userData.profile.full_name;
    roleSelect.value = userData.profile.user_role;
}

async function onFormSubmit(event) {
    event.preventDefault();
    const submitBtnInner = submitBtn.innerHTML;

    formFeedback.clearAllValidations(userForm);
    document.querySelector('#formMessage').innerHTML = '';

    if (!await validateForm()) {
        event.stopPropagation();
        return;
    }
    
    if (!userForm.checkValidity()) {
        event.stopPropagation();
        
        userForm.querySelectorAll(':invalid').forEach((element) => {
            element.classList.add('is-invalid');
        });
        
        return;
    }
    
    const newUser = {
        email: emailInput.value.trim(),
        username: usernameInput.value.trim(),
        full_name: fullnameInput.value.trim(),
        user_role: roleSelect.value
    };
    
    if (passwordInput.value)
        newUser.password = passwordInput.value;

    submitBtn.disabled = true;
    
    let submitSuccess = false;
    if (editMode)
        submitSuccess = await submitEdit(newUser);
    else
        submitSuccess = await submitAdd(newUser);
    
    if (submitSuccess) {
        window.location.href = '/menu/users';
        return;
    }
    
    submitBtn.innerHTML = submitBtnInner;
}

async function submitAdd(newUser) {
    const { data, error } = await dbUser.createUser(newUser);
    
    if (error) {
        console.error(error);
        
        formFeedback.showMessage(
            'danger',
            error.message || 'Não foi possível criar o usuário.'
        );
        
        return false;
    }
    
    if (data) {
        return true;
    }
    
    return false;
}

async function submitEdit(newUser) {
    const { data, error } = await dbUser.updateUser(userData.id, newUser);
    
    if (error) {
        console.error(error);
        
        formFeedback.showMessage(
            'danger',
            error.message || 'Não foi possível criar o usuário.'
        );
        
        return false;
    }
    
    if (data) {
        return true;
    }
    
    return false;
}


async function validateForm() {
    submitBtn.disabled = true;

    const [emailIsValid, usernameIsValid] = await Promise.all([
        checkEmailAva(),
        checkUsernameAva(),
    ]);
    const fullnameIsValid = checkFullname();
    const roleIsValid = checkRole();
    const passwordIsValid = checkPassword();
    const formIsValid = [
        emailIsValid,
        usernameIsValid,
        fullnameIsValid,
        roleIsValid,
        passwordIsValid,
    ].every(Boolean);

    submitBtn.disabled = !formIsValid;
    return formIsValid;
}

function checkPassword() {
    const passwordValue = passwordInput.value;
    const rePasswordValue = rePasswordInput.value;
    
    // Let the browser's required validation handle empty fields.
    formFeedback.clearValidation(passwordInput);
    formFeedback.clearValidation(rePasswordInput);
    
    // Do not show a password error until the user has entered something.
    if (editMode && !passwordValue && !rePasswordValue) {
        // Empty fields in edit mode mean that the existing password is kept.
        return true;
    }
    
    if (!passwordValue && !rePasswordValue) {
        // In add mode, the required attributes handle empty fields on submit.
        return false;
    }
    
    if (passwordValue && passwordValue.length < 6) {
        formFeedback.setInvalid(
            passwordInput,
            'A senha deve ter pelo menos 6 caracteres.'
        );
        return false;
    }
    
    // Only compare the fields once both have a value.
    if (
        passwordValue &&
        rePasswordValue &&
        passwordValue !== rePasswordValue
    ) {
        formFeedback.setInvalid(
            passwordInput,
            'As senhas não coincidem.'
        );
        formFeedback.setInvalid(
            rePasswordInput,
            'As senhas não coincidem.'
        );
        return false;
    }
    
    if (passwordValue && rePasswordValue) {
        formFeedback.setValid(passwordInput);
        formFeedback.setValid(rePasswordInput);
        return true;
    }
    
    // One field is empty, so do not show a mismatch yet. Required validation
    // will handle the incomplete pair when the form is submitted.
    return false;
}

async function populateRoleSelect() {
    const { user, error } = await dbUser.getLoggedUser();
    
    if (error) {
        console.log(error);
        return;
    }
    
    if (!roleSelect || !user) {
        return;
    }
    
    if (user.role === "owner") {
        roleSelect.innerHTML = `
            <option value="" selected disabled> Selecione uma função </option>
            <option value="owner">Dono</option>
            <option value="admin">Admin</option>
            <option value="user">Usuário</option>
        `;
    } else if (user.role === "admin") {
        roleSelect.innerHTML = `
            <option value="user" selected>Usuário</option>
        `;
        
        roleSelect.disabled = true;
    }
}

async function checkUsernameAva() {
    const username = usernameInput.value.trim();
    
    formFeedback.clearValidation(usernameInput);
    
    if (!username) {
        return false;
    }
    
    if (editMode && userData && username === userData.profile.username) {
        formFeedback.setValid(usernameInput);
        lastVerifiedUsername = username;
        return true;
    }

    if (username === lastVerifiedUsername) {
        formFeedback.setValid(usernameInput);
        return true;
    }
    
    usernameInput.classList.add('is-loading');
    
    try {
        const { data, error } = await dbUser.checkUsernameAva(username);
        
        if (error) {
            console.error(error);
            return false;
        }
        
        //Stale Check
        if (usernameInput.value.trim() !== username) {
            return false;
        }

        if (!data?.available) {
            formFeedback.setInvalid(usernameInput, 'Este usuário já está em uso.');
            return false;
        }
        
        lastVerifiedUsername = username;
        formFeedback.setValid(usernameInput);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        usernameInput.classList.remove('is-loading');
    }
}

async function checkEmailAva() {
    const email = emailInput.value.trim();
    
    formFeedback.clearValidation(emailInput);
    
    if (!email || !emailInput.checkValidity()) {
        return false;
    }
    
    if (editMode && userData && email === userData.email) {
        formFeedback.setValid(emailInput);
        lastVerifiedEmail = email;
        return true;
    }

    if (email === lastVerifiedEmail) {
        formFeedback.setValid(emailInput);
        return true;
    }
    
    emailInput.classList.add('is-loading');
    
    try {
        const { data, error } = await dbUser.checkEmailAva(email);
        
        if (error) {
            console.error(error);
            return false;
        }
        
        //Stale Check
        if (emailInput.value.trim() !== email) {
            return false;
        }

        if (!data?.available) {
            formFeedback.setInvalid(emailInput, 'Este email já está cadastrado.');
            return false;
        }
        
        lastVerifiedEmail = email;
        formFeedback.setValid(emailInput);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        emailInput.classList.remove('is-loading');
    }
}

function checkFullname() {
    const fullname = fullnameInput.value.trim();
    
    formFeedback.clearValidation(fullnameInput);
    
    if (!fullname) {
        return false;
    }
    
    formFeedback.setValid(fullnameInput);
    return true;
}

function checkRole() {
    formFeedback.clearValidation(roleSelect);
    
    if (!roleSelect.value) {
        return false;
    }
    
    formFeedback.setValid(roleSelect);
    return true;
}
