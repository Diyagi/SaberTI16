import * as dbCategory from "../../soupabase/category.js";
import * as dbProduct from "../../soupabase/product.js";
import * as formFeedback from "../../../../components/formFeedback.js";

let editMode = false;
let productData;
let form;
let descriptionInput;
let categorySelect;
let priceInput;
let statusSelect;
let observationInput;
let submitButton;

export async function init() {
    editMode = window.location.pathname.includes("products/edit");
    form = document.querySelector("#productForm");
    descriptionInput = document.querySelector("#productDescription");
    categorySelect = document.querySelector("#productCategory");
    priceInput = document.querySelector("#productPrice");
    statusSelect = document.querySelector("#productStatus");
    observationInput = document.querySelector("#productObservation");
    submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", onSubmit);
    descriptionInput.addEventListener("input", () => validateField(checkDescription));
    categorySelect.addEventListener("change", () => validateField(checkCategory));
    priceInput.addEventListener("input", onPriceInput);
    statusSelect.addEventListener("change", () => validateField(checkStatus));
    await populateCategories();

    if (editMode) {
        await loadProduct();
        submitButton.innerHTML = '<i class="bi bi-check-lg"></i> Salvar Alterações';
    } else {
        submitButton.innerHTML = '<i class="bi bi-check-lg"></i> Criar Produto';
    }

    await validateForm();
}

async function populateCategories() {
    const { data: categories, error } = await dbCategory.getCategories();
    if (error) {
        console.error(error);
        categorySelect.innerHTML = '<option value="">Não foi possível carregar as categorias</option>';
        categorySelect.disabled = true;
        return;
    }

    categorySelect.innerHTML = '<option value="" selected disabled>Selecione uma categoria</option>';
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.description;
        categorySelect.appendChild(option);
    });
}

async function loadProduct() {
    const productId = new URLSearchParams(window.location.search).get("productId");
    if (!productId) {
        formFeedback.showMessage("danger", "Produto não encontrado.");
        submitButton.disabled = true;
        return;
    }

    const { data, error } = await dbProduct.getProduct(productId);
    if (error || !data) {
        console.error(error);
        formFeedback.showMessage("danger", "Não foi possível carregar o produto.");
        submitButton.disabled = true;
        return;
    }

    productData = data;
    document.querySelector("#productId").textContent = `ID do Produto: ${data.id}`;
    descriptionInput.value = data.description ?? "";
    categorySelect.value = data.categoryid;
    setPriceValue(data.price);
    statusSelect.value = data.status;
    observationInput.value = data.observation ?? "";

    await validateForm();
}

async function onSubmit(event) {
    event.preventDefault();
    formFeedback.clearAllValidations(form);
    document.querySelector("#formMessage").innerHTML = "";

    if (!await validateForm(true)) {
        return;
    }

    const product = {
        description: descriptionInput.value.trim(),
        categoryid: Number(categorySelect.value),
        price: getPriceValue(),
        status: statusSelect.value,
        observation: observationInput.value.trim() || null
    };
    const buttonContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';

    const { error } = editMode
        ? await dbProduct.updateProduct(productData.id, product)
        : await dbProduct.createProduct(product);

    if (!error) {
        window.location.href = "/menu/products";
        return;
    }

    console.error(error);
    formFeedback.showMessage("danger", error.message || "Não foi possível salvar o produto.");
    submitButton.disabled = false;
    submitButton.innerHTML = buttonContent;
    await validateForm();
}

function onPriceInput() {
    const digits = priceInput.value.replace(/\D/g, "");
    priceInput.value = digits ? formatPrice(Number(digits) / 100) : "";
    validateField(checkPrice);
}

function setPriceValue(price) {
    const value = Number(price);
    priceInput.value = Number.isFinite(value) ? formatPrice(value) : "";
}

function getPriceValue() {
    const digits = priceInput.value.replace(/\D/g, "");
    return digits ? Number(digits) / 100 : null;
}

function formatPrice(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}

async function validateForm(showErrors = false) {
    submitButton.disabled = true;

    const formIsValid = [
        checkDescription(showErrors),
        checkCategory(showErrors),
        checkPrice(showErrors),
        checkStatus(showErrors)
    ].every(Boolean);

    submitButton.disabled = !formIsValid;
    return formIsValid;
}

function validateField(validation) {
    validation(true);
    updateSubmitState();
}

function updateSubmitState() {
    const isValid = Boolean(descriptionInput.value.trim())
        && !categorySelect.disabled
        && Boolean(categorySelect.value)
        && getPriceValue() !== null
        && Boolean(statusSelect.value);

    submitButton.disabled = !isValid;
}

function checkDescription(showErrors) {
    formFeedback.clearValidation(descriptionInput);

    if (!descriptionInput.value.trim()) {
        if (showErrors) formFeedback.setInvalid(descriptionInput, "Informe a descrição do produto.");
        return false;
    }

    formFeedback.setValid(descriptionInput);
    return true;
}

function checkCategory(showErrors) {
    formFeedback.clearValidation(categorySelect);

    if (categorySelect.disabled || !categorySelect.value) {
        if (showErrors) formFeedback.setInvalid(categorySelect, "Selecione uma categoria.");
        return false;
    }

    formFeedback.setValid(categorySelect);
    return true;
}

function checkPrice(showErrors) {
    formFeedback.clearValidation(priceInput);

    if (getPriceValue() === null) {
        if (showErrors) formFeedback.setInvalid(priceInput, "Informe um preço válido.");
        return false;
    }

    formFeedback.setValid(priceInput);
    return true;
}

function checkStatus(showErrors) {
    formFeedback.clearValidation(statusSelect);

    if (!statusSelect.value) {
        if (showErrors) formFeedback.setInvalid(statusSelect, "Selecione um status.");
        return false;
    }

    formFeedback.setValid(statusSelect);
    return true;
}
