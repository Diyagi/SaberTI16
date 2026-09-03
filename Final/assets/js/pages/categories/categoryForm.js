import * as dbCategory from "../../soupabase/category.js";

let editMode = false;
let catData;

let catForm;
let descInput;
let submitBtn;

export async function init() {
	const currentPath = window.location.pathname;
	editMode = currentPath.includes("categories/edit");
	catForm = document.querySelector("#categoryForm");
	submitBtn = catForm.querySelector('button[type="submit"]');
	descInput = document.querySelector("#categoryDesc");
    
	catForm.addEventListener("submit", onFormSubmit);
    
	if (editMode) {
		await loadCategoryData();
		submitBtn.innerHTML = `<i class="bi bi-check-lg"></i>Salvar Alterações`
	} else {
		submitBtn.innerHTML = `<i class="bi bi-check-lg"></i>Criar Categoria`
	}
}

async function loadCategoryData() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const catId = urlParams.get("catId");

	const { data, error } = await dbCategory.getCategory(catId);
	catData = data;

	const catIdText = document.querySelector("#categoryId");

	catIdText.textContent = `ID da Categoria: ${data.id}`;
	descInput.value = data.description;
}

async function onFormSubmit(event) {
	event.preventDefault();

	const descValue = descInput.value.trim();

	if (!descValue) {
		setInvalid(descInput, "Descrição não pode estar vazia.");
		return;
	}

	const submitBtnInner = submitBtn.innerHTML;
	submitBtn.disabled = true;
	submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Processando...`;

	clearValidation(descInput);

    let submitSuccess;

	if (editMode) {
		submitSuccess = await submitEdit();
	} else {
		submitSuccess = await submitAdd();
	}

	if (submitSuccess) {
		window.location.href = "/menu/categories";
        return;
	}

	submitBtn.innerHTML = submitBtnInner;
	submitBtn.disabled = false;
}

async function submitAdd() {
	const descValue = descInput.value.trim();

	const { data, error } = await dbCategory.createCategory({
		description: descValue,
	});

	if (error) {
		console.log(error);
		showMessage(
			"danger",
			error.message || "Não foi possível criar a categoria.",
		);
		return false;
	}

	return true;
}

async function submitEdit() {
	const descValue = descInput.value.trim();

	const { data, error } = await dbCategory.updateCategory(catData.id, {
		description: descValue,
	});

	if (error) {
		console.log(error);
		showMessage(
			"danger",
			error.message || "Não foi possível editar a categoria.",
		);
		return false;
	}

	return true;
}

function setInvalid(element, message) {
	clearValidation(element);

	element.classList.add("is-invalid");

	const feedback = document.createElement("div");
	feedback.className = "invalid-feedback";
	feedback.textContent = message;

	element.parentElement.appendChild(feedback);
}

function clearValidation(element) {
	element.classList.remove("is-invalid", "is-valid", "is-loading");

	const feedback = element.parentElement.querySelector(
		".invalid-feedback, .valid-feedback",
	);

	if (feedback) {
		feedback.remove();
	}
}

function showMessage(type, message) {
	const formMessage = document.querySelector("#formMessage");

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
