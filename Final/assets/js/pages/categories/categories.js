import * as dbCategory from "../../soupabase/category.js";
import { confirmModal, showConfirmationError } from "../../../../components/confirmationModal.js";
import { reloadCurrentView } from "../../router.js";

export async function init() {
    document.querySelector("#catTableBody").addEventListener("click", onTableClick);
    await loadCategories();
}

async function loadCategories() {
    const tableBody = document.querySelector("#catTableBody");
    const { data: categories, error } = await dbCategory.getCategories();

    if (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Não foi possível carregar as categorias.</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    if (!categories?.length) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Nenhuma categoria cadastrada.</td></tr>';
        return;
    }

    categories.forEach((category) => {
        const row = document.createElement("tr");
        const categoryId = category.id;
        const description = category.description ?? "";

        row.innerHTML = `
            <td>${categoryId}</td>
            <td></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning edit-category" data-id="${categoryId}" title="Editar" aria-label="Editar categoria">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-category" data-id="${categoryId}" title="Excluir" aria-label="Excluir categoria">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        row.children[1].textContent = description;
        row.querySelector(".delete-category").dataset.name = description || "esta categoria";
        tableBody.appendChild(row);
    });
}

function onTableClick(event) {
    const editButton = event.target.closest(".edit-category");
    if (editButton) {
        window.location.href = `/menu/categories/edit?catId=${editButton.dataset.id}`;
        return;
    }

    const deleteButton = event.target.closest(".delete-category");
    if (!deleteButton) return;

    confirmModal({
        title: "Deletar Categoria",
        message: `Tem certeza que deseja deletar a categoria <b>${escapeHtml(deleteButton.dataset.name)}</b>?`,
        confirmText: "Deletar",
        loadingText: "Deletando",
        onConfirm: async () => {
            const { error } = await dbCategory.deleteCategory(deleteButton.dataset.id);
            if (error) {
                console.error(error);
                showConfirmationError(getDeleteErrorMessage(error));
                return false;
            }

            await reloadCurrentView();
        }
    });
}

function getDeleteErrorMessage(error) {
    return error?.code === "23503"
        ? "Esta categoria está em uso e não pode ser excluída até que os recursos relacionados sejam removidos."
        : "Não foi possível excluir a categoria. Tente novamente.";
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
