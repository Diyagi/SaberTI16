import * as dbUser from "../../soupabase/user.js";

export async function init() {
    const addUserForm = document.querySelector('#addUserForm');
    const usernameInput = document.querySelector('#username');
    const emailInput = document.querySelector('#email');
    
    await populateRoleSelect();
    addUserForm.addEventListener('submit', async (event) => { await onFormSubmit(event) });
    
    usernameInput.addEventListener('blur', async () => {
        const username = usernameInput.value.trim();
        
        if (!username) {
            return;
        }
        
        // Remove previous validation
        clearValidation(usernameInput);
        
        usernameInput.classList.add('is-loading');
        
        const { data, error } = await dbUser.checkUsernameAva(username);
        
        usernameInput.classList.remove('is-loading');
        
        if (error) {
            console.error(error);
            return;
        }
        
        if (!data.available) {
            setInvalid(
                usernameInput,
                'Este usuário já está em uso.'
            );
            return;
        }
        
        setValid(
            usernameInput
        );
    });
    
    emailInput.addEventListener('blur', async () => {
        const email = emailInput.value.trim();
        
        if (!email || !emailInput.checkValidity()) {
            return;
        }
        
        clearValidation(emailInput);
        
        emailInput.classList.add('is-loading');
        
        const { data, error } = await dbUser.checkEmailAva(email);
        
        emailInput.classList.remove('is-loading');
        
        if (error) {
            console.error(error);
            return;
        }
        
        if (!data.available) {
            setInvalid(
                emailInput,
                'Este email já está cadastrado.'
            );
            return;
        }
        
        setValid(
            emailInput
        );
    });
}

async function onFormSubmit(event) {
    event.preventDefault();
    
    // Remove previous validation states/messages
    addUserForm.querySelectorAll('.is-invalid').forEach((element) => {
        element.classList.remove('is-invalid');
    });
    
    addUserForm.querySelectorAll('.invalid-feedback').forEach((element) => {
        element.remove();
    });
    
    document.querySelector('#formMessage').innerHTML = '';
    
    // Get values
    const email = document.querySelector('#email');
    const username = document.querySelector('#username');
    const fullName = document.querySelector('#fullName');
    const password = document.querySelector('#password');
    const passwordConfirm = document.querySelector('#passwordConfirm');
    const roleSelect = document.querySelector('#userRole');
    
    // Let Bootstrap/browser handle required + email validation
    if (!addUserForm.checkValidity()) {
        event.stopPropagation();
        
        addUserForm.querySelectorAll(':invalid').forEach((element) => {
            element.classList.add('is-invalid');
        });
        
        return;
    }
    
    // Password length
    if (password.value.length < 6) {
        setInvalid(
            password,
            'A senha deve ter pelo menos 6 caracteres.'
        );
        return;
    }
    
    // Password confirmation
    if (password.value !== passwordConfirm.value) {
        setInvalid(
            passwordConfirm,
            'As senhas não coincidem.'
        );
        
        setInvalid(
            password,
            'As senhas não coincidem.'
        );
        return;
    }
    
    const newUser = {
        email: email.value.trim(),
        username: username.value.trim(),
        full_name: fullName.value.trim(),
        password: password.value,
        user_role: roleSelect.value
    };
    
    try {
        // Change this to your actual method
        const { data, error } = await dbUser.createUser(newUser);
        
        if (error) {
            console.error(error);
            
            showMessage(
                'danger',
                error.message || 'Não foi possível criar o usuário.'
            );
            
            return;
        }
        
        showMessage(
            'success',
            'Usuário criado com sucesso!'
        );
        
        addUserForm.reset();
        
        // If you want to redirect:
        // setTimeout(() => {
            //     window.location.href = '/users';
        // }, 1000);
        
    } catch (error) {
        console.error(error);
        
        showMessage(
            'danger',
            'Ocorreu um erro ao criar o usuário.'
        );
    }   
}

function setInvalid(element, message) {
    clearValidation(element);
    
    element.classList.add('is-invalid');
    
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    
    element.parentElement.appendChild(feedback);
}


function setValid(element, message) {
    clearValidation(element);
    
    element.classList.add('is-valid');
    
    if (message) {
        const feedback = document.createElement('div');
        feedback.className = 'valid-feedback';
        feedback.textContent = message;
        
        element.parentElement.appendChild(feedback);
    }
}


function clearValidation(element) {
    element.classList.remove('is-invalid', 'is-valid', 'is-loading');
    
    const feedback = element.parentElement.querySelector(
        '.invalid-feedback, .valid-feedback'
    );
    
    if (feedback) {
        feedback.remove();
    }
}


function showMessage(type, message) {
    const formMessage = document.querySelector('#formMessage');
    
    formMessage.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Fechar"
            ></button>
        </div>
    `;
}

async function populateRoleSelect() {
    const roleSelect = document.querySelector('#userRole');
    
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
