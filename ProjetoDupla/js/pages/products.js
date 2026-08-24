import * as productData from "../persistence/products.js"
import * as categoryData from "../persistence/category.js"
import { showConfirmation } from "../confirmationModal.js";

const BRLFormat = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

let editingItemId;
let addProductModal;
let addProductModalLabel;
let addProductForm;
let modalItemName;
let modalItemPrice;
let modalItemCategory;
let modalItemShortDescription;
let modalItemDescription;
let modalSubmitItemBtn;
let addProductBtn;

export function init() {
    addProductModal = document.getElementById("addProductModal");
    addProductModalLabel = document.getElementById("addProductModalLabel");
    addProductForm = document.getElementById("addProductForm");
    modalItemName = document.getElementById("itemName");
    modalItemPrice = document.getElementById("itemPrice");
    modalItemCategory = document.getElementById("itemCategory");
    modalItemShortDescription = document.getElementById("itemShortDescription");
    modalItemDescription = document.getElementById("itemDescription");
    modalSubmitItemBtn = document.getElementById("submitItem");
    addProductBtn = document.getElementById("addProductBtn");
    
    addProductForm.addEventListener("submit", () => submitAddProdModal());
    addProductBtn.addEventListener("click", () => openAddItemModal());

    loadProducts();
    popSelectAddProd();
}

function loadProducts() {
    const productContent = document.getElementById("productContent");
    
    while (productContent.firstChild) {
        productContent.removeChild(productContent.firstChild);
    }
    
    productData.getAll().forEach(element => {
        const tr = document.createElement("tr");
        const tdId = document.createElement("th");
        const tdName = document.createElement("td");
        const tdDesc = document.createElement("td");
        const tdShortDesc = document.createElement("td");
        const tdCategory = document.createElement("td");
        const tdPrice = document.createElement("td");
        const tdOptions = document.createElement("td");
        const optionsDiv = document.createElement("div");
        
        tdId.scope = "row";
        tdId.className = "column-center";
        tdName.className = "column-left";
        tdDesc.className = "column-left";
        tdShortDesc.className = "column-left";
        tdCategory.className = "column-left";
        tdPrice.className = "column-left";
        tdOptions.className = "column-center";
        optionsDiv.className = "options-div";
        
        const catObj = categoryData.getById(element.categoryId);
        const catName = catObj ? catObj.name : "Desconhecido";
        
        tdId.innerText = element.id;
        tdName.innerText = element.name;
        tdDesc.innerText = element.description;
        tdShortDesc.innerText = element.shortDescription;
        tdCategory.innerText = catName;
        tdPrice.innerText = BRLFormat.format(element.price.toFixed(2));
        
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdDesc);
        tr.appendChild(tdShortDesc);
        tr.appendChild(tdCategory);
        tr.appendChild(tdPrice);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "row-delete";
        const deleteBtnI = document.createElement("i");
        deleteBtnI.className = "fa fa-trash btn-image";
        deleteBtn.addEventListener("click", () => deleteProduct(element));
        
        deleteBtn.appendChild(deleteBtnI);
        
        const editBtn = document.createElement("button");
        editBtn.className = "row-edit";
        const editBtnI = document.createElement("i");
        editBtnI.className = "fa fa-pen btn-image";
        editBtn.addEventListener("click", () => openEditItemModal(element));
        
        editBtn.appendChild(editBtnI);
        
        optionsDiv.appendChild(editBtn);
        optionsDiv.appendChild(deleteBtn);
        
        tdOptions.appendChild(optionsDiv);
        tr.appendChild(tdOptions);
        
        productContent.appendChild(tr);
    });
}

function deleteProduct(product) {
    showConfirmation(`Tem certeza que deseja excluir o produto ${product.name}?`, () => {
        productData.remove(product.id);
        loadProducts();
    });
}

function openAddItemModal() {
    editingItemId = null;
    
    addProductForm.reset();
    
    addProductModalLabel.textContent = "Adicionar Produto";
    modalSubmitItemBtn.textContent = "Adicionar";
    
    bootstrap.Modal
    .getOrCreateInstance(addProductModal)
    .show();
}

function openEditItemModal(item) {
    editingItemId = item.id;

    addProductForm.reset();
    
    modalItemName.value = item.name;
    modalItemDescription.value = item.description;
    modalItemShortDescription.value = item.shortDescription;
    modalItemCategory.value = item.categoryId;
    modalItemPrice.value = item.price;
    
    addProductModalLabel.textContent = "Editar Produto";
    modalSubmitItemBtn.textContent = "Salvar";
    
    bootstrap.Modal
    .getOrCreateInstance(addProductModal)
    .show();
}

function submitAddProdModal() {
    event.preventDefault();
    const modal = bootstrap.Modal.getInstance(addProductModal);
    
    const item = {
        name: modalItemName.value,
        description: modalItemDescription.value,
        shortDescription: modalItemShortDescription.value,
        categoryId: Number(modalItemCategory.value),
        price: Number(modalItemPrice.value)
    };
    
    if (editingItemId === null) {
        productData.create(item);
    } else {
        productData.update(editingItemId, item);
    }
    
    loadProducts();
    modal.hide();
}

function popSelectAddProd() {
    const categories = categoryData.getAll();
    
    categories.forEach((category) => {
        const option = document.createElement("option");
        
        option.value = category.id;
        option.textContent = category.name;
        
        modalItemCategory.appendChild(option);
    });
}