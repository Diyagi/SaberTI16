import * as categoryData from "../persistence/category.js"
import { showConfirmation } from "../confirmationModal.js";

let editingItemId;
let addCategoryModal;
let addCategoryModalLabel;
let addCategoryForm;
let modalCategoryName;
let modalCategoryDescription;
let modalSubmitBtn;
let addCategoryBtn;

export function init() {
    editingItemId = document.getElementById("editingItemId");
    addCategoryModal = document.getElementById("addCategoryModal");
    addCategoryModalLabel = document.getElementById("addCategoryModalLabel");
    addCategoryForm = document.getElementById("addCategoryForm");
    modalCategoryName = document.getElementById("categoryName");
    modalCategoryDescription = document.getElementById("categoryDescription");
    modalSubmitBtn = document.getElementById("submitForm");
    addCategoryBtn = document.getElementById("addCategoryBtn");
    
    addCategoryForm.addEventListener("submit", () => submitCategoryForm());
    addCategoryBtn.addEventListener("click", () => openAddCategoryModal());

    loadCategory();
}

function loadCategory(element) {
    const categoryContent = document.getElementById("categoryContent");
    
    while (categoryContent.firstChild) {
        categoryContent.removeChild(categoryContent.firstChild);
    }
    
    categoryData.getAll().forEach(element => {
        
        const tr = document.createElement("tr");
        const tdId = document.createElement("th");
        const tdName = document.createElement("td");
        const tdDesc = document.createElement("td");
        const tdOptions = document.createElement("td")
        const optionsDiv = document.createElement("div");
        
        tdId.scope = "row";
        tdId.className = "column-center";
        tdName.className = "column-left";
        tdDesc.className = "column-left";
        tdOptions.className = "column-center";
        optionsDiv.className = "options-div";
        
        tdId.innerText = element.id;
        tdName.innerText = element.name;
        tdDesc.innerText = element.description;
        
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdDesc);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "row-delete";
        const deleteBtnI = document.createElement("i");
        deleteBtnI.className = "fa fa-trash btn-image";
        deleteBtn.addEventListener("click", () => deleteCategory(element));
        
        deleteBtn.appendChild(deleteBtnI);
        
        const editBtn = document.createElement("button");
        editBtn.className = "row-edit"
        const editBtnI = document.createElement("i");
        editBtnI.className = "fa fa-pen btn-image";
        editBtn.addEventListener("click", () => openEditCategoryModal(element));
        
        editBtn.appendChild(editBtnI);
        
        optionsDiv.appendChild(editBtn);
        optionsDiv.appendChild(deleteBtn);
        
        tdOptions.appendChild(optionsDiv);
        tr.appendChild(tdOptions);
        
        categoryContent.appendChild(tr);
    });
};

function deleteCategory(category) {
    showConfirmation(`Tem certeza que deseja excluir a categoria ${category.name}?`, () => {
        categoryData.remove(category.id);
        loadCategory();
    });
}

function openEditCategoryModal(category) {
    editingItemId = category.id;
    
    addCategoryForm.reset();
    
    modalCategoryName.value = category.name;
    modalCategoryDescription.value = category.description;
    
    addCategoryModalLabel.textContent = "Editar Cliente";
    modalSubmitBtn.textContent = "Salvar";
    
    bootstrap.Modal
    .getOrCreateInstance(addCategoryModal)
    .show();
}

function openAddCategoryModal() {
    editingItemId = null;
    
    addCategoryForm.reset();
    
    addCategoryModalLabel.textContent = "Adicionar Categoria";
    modalSubmitBtn.textContent = "Adicionar";
    
    bootstrap.Modal
    .getOrCreateInstance(addCategoryModal)
    .show();
}

function submitCategoryForm() {
    event.preventDefault();
    const modal = bootstrap.Modal.getInstance(addCategoryModal);
    
    const item = {
        name: modalCategoryName.value,
        description: modalCategoryDescription.value,
    };
    
    if (editingItemId === null) {
        categoryData.create(item);
    } else {
        categoryData.update(editingItemId, item);
    }
    
    loadCategory();
    modal.hide();
}
