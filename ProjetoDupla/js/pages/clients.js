import * as clientData from "../persistence/client.js"
import { showConfirmation } from "../confirmationModal.js";

let editingItemId;
let addClientModal;
let addClientModalLabel;
let addClientForm;
let modalClientName;
let modalClientEmail;
let modalClientPhone;
let modalClientAddress;
let modalSubmitBtn;
let addClientBtn;

export function init() {
    addClientModal = document.getElementById("addClientModal");
    addClientModalLabel = document.getElementById("addClientModalLabel");
    addClientForm = document.getElementById("addClientForm");
    modalClientName = document.getElementById("clientName");
    modalClientEmail = document.getElementById("clientEmail");
    modalClientPhone = document.getElementById("clientPhone");
    modalClientAddress = document.getElementById("clientAddress");
    modalSubmitBtn = document.getElementById("submitForm")
    addClientBtn = document.getElementById("addClientBtn");
    
    
    addClientForm.addEventListener("submit", () => submitClientForm());
    addClientBtn.addEventListener("click", () => openAddClientModal());
    
    loadClients();
}

function loadClients() {
    const clientContent = document.getElementById("clientContent");
    
    while (clientContent.firstChild) {
        clientContent.removeChild(clientContent.firstChild);
    }
    
    clientData.getAll().forEach(element => {
        const tr = document.createElement("tr");
        const tdId = document.createElement("th");
        const tdName = document.createElement("td");
        const tdEmail = document.createElement("td");
        const tdPhone = document.createElement("td");
        const tdAddress = document.createElement("td");
        const tdOptions = document.createElement("td");
        const optionsDiv = document.createElement("div");
        
        tdId.scope = "row"
        tdId.className = "column-center"
        tdName.className = "column-left";
        tdEmail.className = "column-left";
        tdPhone.className = "column-left";
        tdAddress.className = "column-left";
        tdOptions.className = "column-center";
        optionsDiv.className = "options-div"
        
        tdId.innerText = element.id;
        tdName.innerText = element.name;
        tdEmail.innerText = element.email;
        tdPhone.innerText = formatPhone(element.phone);
        tdAddress.innerText = element.address;
        
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdEmail);
        tr.appendChild(tdPhone);
        tr.appendChild(tdAddress);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "row-delete";
        const deleteBtnI = document.createElement("i");
        deleteBtnI.className = "fa fa-trash btn-image";
        deleteBtn.addEventListener("click", () => deleteClient(element));
        
        deleteBtn.appendChild(deleteBtnI);
        
        const editBtn = document.createElement("button");
        editBtn.className = "row-edit"
        const editBtnI = document.createElement("i");
        editBtnI.className = "fa fa-pen btn-image";
        editBtn.addEventListener("click", () => openEditClientModal(element));
        
        editBtn.appendChild(editBtnI);
        
        optionsDiv.appendChild(editBtn);
        optionsDiv.appendChild(deleteBtn);
        
        tdOptions.appendChild(optionsDiv);
        tr.appendChild(tdOptions);
        
        clientContent.appendChild(tr)
    });
}

function formatPhone(phone) {
    const value = String(phone).replace(/\D/g, "");

    if (value.length === 11) {
        return value.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    if (value.length === 10) {
        return value.replace(
            /^(\d{2})(\d{4})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    return phone;
}

function deleteClient(client) {
    showConfirmation(`Tem certeza que deseja excluir o(a) cliente ${client.name}?`, () => {
        clientData.remove(client.id);
        loadClients();
    });
}

function openEditClientModal(category) {
    editingItemId = category.id;
    
    addClientForm.reset();
    
    modalClientName.value = category.name;
    modalClientEmail.value = category.email;
    modalClientPhone.value = category.phone;
    modalClientAddress.value = category.address;
    
    addClientModalLabel.textContent = "Editar Cliente";
    modalSubmitBtn.textContent = "Salvar";
    
    bootstrap.Modal
    .getOrCreateInstance(addClientModal)
    .show();
}

function openAddClientModal() {
    editingItemId = null;
    
    addClientForm.reset();
    
    addClientModalLabel.textContent = "Adicionar Cliente";
    modalSubmitBtn.textContent = "Adicionar";
    
    bootstrap.Modal
    .getOrCreateInstance(addClientModal)
    .show();
}

function submitClientForm() {
    event.preventDefault();
    const modal = bootstrap.Modal.getInstance(addClientModal);
    
    const item = {
        name: modalClientName.value,
        email: modalClientEmail.value,
        phone: Number(modalClientPhone.value),
        address: modalClientAddress.value
    };
    
    if (editingItemId === null) {
        clientData.create(item);
    } else {
        clientData.update(editingItemId, item);
    }
    
    loadClients();
    modal.hide();
}
