import * as dbClient from "../../soupabase/client.js";
import { confirmModal, showConfirmationError } from "../../../../components/confirmationModal.js";
import { reloadCurrentView } from "../../router.js";

export async function init() {
    document.querySelector("#clientTableBody").addEventListener("click", onTableClick);
    await loadClients();
}

async function loadClients() {
    const tableBody = document.querySelector("#clientTableBody");
    const { data: clients, error } = await dbClient.getClients();

    if (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Não foi possível carregar os clientes.</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    if (!clients?.length) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhum cliente cadastrado.</td></tr>';
        return;
    }

    clients.forEach((client) => {
        const row = document.createElement("tr");
        const name = client.name ?? "";

        row.innerHTML = `
            <td>${client.id}</td>
            <td></td>
            <td></td>
            <td><span class="badge text-bg-secondary"></span></td>
            <td></td>
            <td></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning edit-client" data-id="${client.id}" title="Editar" aria-label="Editar cliente">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-client" data-id="${client.id}" title="Excluir" aria-label="Excluir cliente">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        row.children[1].textContent = name;
        row.children[2].textContent = formatDocument(client.cpf_cnpj);
        row.querySelector(".badge").textContent = formatClientType(client.clienttype);
        row.children[4].textContent = formatPhone(client.phone);
        row.children[5].textContent = client.email ?? "—";
        row.querySelector(".delete-client").dataset.name = name || "este cliente";
        tableBody.appendChild(row);
    });
}

function onTableClick(event) {
    const editButton = event.target.closest(".edit-client");
    if (editButton) {
        window.location.href = `/menu/clients/edit?clientId=${editButton.dataset.id}`;
        return;
    }

    const deleteButton = event.target.closest(".delete-client");
    if (!deleteButton) return;

    confirmModal({
        title: "Deletar Cliente",
        message: `Tem certeza que deseja deletar o cliente <b>${escapeHtml(deleteButton.dataset.name)}</b>?`,
        confirmText: "Deletar",
        loadingText: "Deletando",
        onConfirm: async () => {
            const { error } = await dbClient.deleteClient(deleteButton.dataset.id);
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
        ? "Este cliente está em uso e não pode ser excluído até que os recursos relacionados sejam removidos."
        : "Não foi possível excluir o cliente. Tente novamente.";
}

function formatClientType(type) {
    return String(type).toUpperCase() === "PJ" ? "Pessoa Jurídica" : "Pessoa Física";
}

function formatDocument(document) {
    const digits = String(document ?? "").replace(/\D/g, "");
    if (digits.length === 11) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    if (digits.length === 14) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    return document || "—";
}

function formatPhone(phone) {
    const digits = String(phone ?? "").replace(/\D/g, "");
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    return phone || "—";
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
