import * as dbProduct from "../../soupabase/product.js";
import { confirmModal, showConfirmationError } from "../../../../components/confirmationModal.js";
import { reloadCurrentView } from "../../router.js";

export async function init() {
    document.querySelector("#productTableBody").addEventListener("click", onTableClick);
    await loadProducts();
}

async function loadProducts() {
    const tableBody = document.querySelector("#productTableBody");
    const { data: products, error } = await dbProduct.getProducts();

    if (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Não foi possível carregar os produtos.</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    if (!products?.length) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    products.forEach((product) => {
        const row = document.createElement("tr");
        const category = product.category?.description ?? "Sem categoria";
        const status = getStatus(product.status);

        row.innerHTML = `
            <td>${product.id}</td>
            <td></td>
            <td></td>
            <td></td>
            <td><span class="badge ${status.active ? "text-bg-success" : "text-bg-danger"}"></span></td>
            <td></td>
            <td></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning edit-product" data-id="${product.id}" title="Editar" aria-label="Editar produto">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}" title="Excluir" aria-label="Excluir produto">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        row.children[1].textContent = product.description ?? "";
        row.children[2].textContent = category;
        row.children[3].textContent = formatPrice(product.price);
        row.querySelector(".badge").textContent = status.label;
        row.children[5].textContent = product.observation ?? "—";
        row.children[6].textContent = formatDate(product.created_at);
        row.querySelector(".delete-product").dataset.name = product.description ?? "este produto";
        tableBody.appendChild(row);
    });

}

function getStatus(status) {
    const value = String(status ?? "").toLowerCase();
    const active = value === "active" || value === "ativo";

    return { active, label: active ? "Ativo" : "Inativo" };
}

function formatPrice(price) {
    const value = Number(price);
    if (!Number.isFinite(value)) return "—";

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}

function formatDate(date) {
    if (!date) return "—";

    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(value);
}

function onTableClick(event) {
    const editButton = event.target.closest(".edit-product");
    if (editButton) {
        window.location.href = `/menu/products/edit?productId=${editButton.dataset.id}`;
        return;
    }

    const deleteButton = event.target.closest(".delete-product");
    if (!deleteButton) return;

    confirmModal({
        title: "Deletar Produto",
        message: `Tem certeza que deseja deletar o produto <b>${escapeHtml(deleteButton.dataset.name)}</b>?`,
        confirmText: "Deletar",
        loadingText: "Deletando",
        onConfirm: async () => {
            const { error } = await dbProduct.deleteProduct(deleteButton.dataset.id);
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
        ? "Este produto está em uso e não pode ser excluído até que os recursos relacionados sejam removidos."
        : "Não foi possível excluir o produto. Tente novamente.";
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
