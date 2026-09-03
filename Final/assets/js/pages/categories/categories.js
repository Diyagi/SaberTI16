import * as dbCategory from "../../soupabase/category.js";
import { confirmModal } from "../../../../components/confirmationModal.js";

export async function init() {
    loadCategories();
}

async function loadCategories() {
	const {data, error} = await dbCategory.getCategories();
	const tableBody = document.querySelector("#catTableBody");
    tableBody.innerHTML = '';

	data.forEach((category) => {
		const row = document.createElement("tr");
        const catId = category?.id ?? ""
        const catDesc = category?.description ?? "Desconhecido"

		row.innerHTML = `
            <td>${catId}</td>
            <td>${catDesc}</td>
            <td class="text-end">
                <button 
                    class="btn btn-sm btn-warning edit-cat"
                    data-id="${catId}"
                    title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
        
                <button 
                    class="btn btn-sm btn-danger delete-cat"
                    data-id="${catId}"
                    data-name="${catDesc}"
                    title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

		tableBody.appendChild(row);
	});

    tableBody.addEventListener("click", onTableClick);
}

function onTableClick(event) {
    const target = event.target;

    const editBtn = target.closest(".edit-cat");
    if (editBtn) {
        window.location.href = `/menu/categories/edit?catId=${editBtn.dataset.id}`;
        return;
    }

    const deleteBtn = target.closest(".delete-cat");
    if (deleteBtn) {
        confirmModal({
            title: "Deletar Categoria",
            message: `Tem certeza que deseja deletar a categoria <b>${deleteBtn.dataset.name}</b>?`,
            confirmText: "Deletar",
            loadingText: "Deletando",
            onConfirm: async () => {
                await dbCategory.deleteCategory(deleteBtn.dataset.id);
                loadCategories();
            },
        });
        return;
    }
}
