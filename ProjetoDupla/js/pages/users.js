import * as userData from "../persistence/users.js"
import { showConfirmation } from "../confirmationModal.js";

let editingItemId;
let addUserModal;
let addUserModalLabel;
let addUserForm;
let modalUserName;
let modalUserLogin;
let modalUserEmail;
let modalUserPassword;
let modalSubmitBtn;
let addUserBtn;

export function init() {
    addUserModal = document.getElementById("addUserModal");
    addUserModalLabel = document.getElementById("addUserModalLabel");
    addUserForm = document.getElementById("addUserForm");
    modalUserName = document.getElementById("userName");
    modalUserLogin = document.getElementById("userLogin");
    modalUserEmail = document.getElementById("userEmail");
    modalUserPassword = document.getElementById("userPassword");
    modalSubmitBtn = document.getElementById("submitForm");
    addUserBtn = document.getElementById("addUserBtn");
    
    addUserForm.addEventListener("submit", () => submitUserForm());
    addUserBtn.addEventListener("click", () => openAddUserModal());
    
    loadUsers();
}

function loadUsers() {
    console.log("Loading users")
    const userContent = document.getElementById("userContent");
    
    while (userContent.firstChild) {
        userContent.removeChild(userContent.firstChild);
    }
    
    userData.getAll().forEach(element => {
        const tr = document.createElement("tr");
        const tdId = document.createElement("th");
        const tdName = document.createElement("td");
        const tdUsername = document.createElement("td");
        const tdEmail = document.createElement("td");
        const tdOptions = document.createElement("td");
        const optionsDiv = document.createElement("div");
        
        tdId.scope = "row";
        tdId.className = "column-center"
        tdName.className = "column-left"
        tdUsername.className = "column-left"
        tdEmail.className = "column-left"
        tdOptions.className = "column-center"
        optionsDiv.className = "options-div"
        
        tdId.innerText = element.id;
        tdName.innerText = element.name;
        tdUsername.innerText = element.username;
        tdEmail.innerText = element.email
        
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdUsername);
        tr.appendChild(tdEmail);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "row-delete";
        const deleteBtnI = document.createElement("i");
        deleteBtnI.className = "fa fa-trash btn-image";
        deleteBtn.addEventListener("click", () => deleteUser(element));
        
        deleteBtn.appendChild(deleteBtnI);
        
        const editBtn = document.createElement("button");
        editBtn.className = "row-edit"
        const editBtnI = document.createElement("i");
        editBtnI.className = "fa fa-pen btn-image";
        editBtn.addEventListener("click", () => openEditUserModal(element));
        
        editBtn.appendChild(editBtnI);
        
        optionsDiv.appendChild(editBtn);
        optionsDiv.appendChild(deleteBtn);
        
        tdOptions.appendChild(optionsDiv);
        tr.appendChild(tdOptions);
        
        userContent.appendChild(tr)
    });
}

function deleteUser(user) {
    showConfirmation(`Tem certeza que deseja excluir o(a) Usuario(a) ${user.name}?`, () => {
        userData.remove(user.id);
        loadUsers();
    });
}

function openEditUserModal(user) {
    editingItemId = user.id;
    
    addUserForm.reset();
    
    modalUserName.value = user.name;
    modalUserEmail.value = user.email;
    modalUserLogin.value = user.username;
    
    addUserModalLabel.textContent = "Editar Usuario";
    modalSubmitBtn.textContent = "Salvar";
    
    bootstrap.Modal
    .getOrCreateInstance(addUserModal)
    .show();
}

function openAddUserModal() {
    editingItemId = null;
    
    addUserForm.reset();
    
    addUserModalLabel.textContent = "Adicionar Usuario";
    modalSubmitBtn.textContent = "Adicionar";
    
    bootstrap.Modal
    .getOrCreateInstance(addUserModal)
    .show();
}

async function submitUserForm() {
    event.preventDefault();
    const modal = bootstrap.Modal.getInstance(addUserModal);
    
    const user = {
        name: modalUserName.value,
        email: modalUserEmail.value,
        username: modalUserLogin.value,
        password: modalUserPassword.value
    };
    
    if (editingItemId === null) {
        await userData.create(user);
    } else {
        await userData.update(editingItemId, user);
        
        if (user.password !== "") {
            await userData.updatePassword(editingItemId, user.password)
        }
    }
    
    loadUsers();
    modal.hide();
}
