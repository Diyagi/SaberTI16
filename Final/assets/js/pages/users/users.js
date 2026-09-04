import * as dbUser from "../../soupabase/user.js";
import { confirmModal, showConfirmationError } from "../../../../components/confirmationModal.js";
import { reloadCurrentView } from "../../router.js";

export async function init() {
    document.querySelector("#usersTableBody").addEventListener("click", onTableClick);
    await loadUsers();
}

async function loadUsers() {
    const tableBody = document.querySelector("#usersTableBody");
    const { data, error } = await dbUser.getUsers();
    const users = data?.users;

    if (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Não foi possível carregar os usuários.</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    if (!users?.length) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum usuário cadastrado.</td></tr>';
        return;
    }

    users.forEach((user) => {
        const row = document.createElement("tr");
        const profile = user.profile ?? {};
        const name = profile.full_name ?? "";

        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td><span class="badge text-bg-secondary"></span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning edit-user" data-id="${user.id}" title="Editar" aria-label="Editar usuário">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}" title="Excluir" aria-label="Excluir usuário">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        row.children[0].textContent = user.email ?? "";
        row.children[1].textContent = profile.username ?? "";
        row.children[2].textContent = name;
        row.querySelector(".badge").textContent = formatRole(profile.user_role);
        row.querySelector(".delete-user").dataset.name = name || "este usuário";
        tableBody.appendChild(row);
    });
}

function onTableClick(event) {
    const editButton = event.target.closest(".edit-user");
    if (editButton) {
        window.location.href = `/menu/users/edit?userId=${editButton.dataset.id}`;
        return;
    }

    const deleteButton = event.target.closest(".delete-user");
    if (!deleteButton) return;

    confirmModal({
        title: "Deletar Usuário",
        message: `Tem certeza que deseja deletar o usuário <b>${escapeHtml(deleteButton.dataset.name)}</b>?`,
        confirmText: "Deletar",
        loadingText: "Deletando",
        onConfirm: async () => {
            const { error } = await dbUser.deleteUser(deleteButton.dataset.id);
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
        ? "Este usuário está em uso e não pode ser excluído até que os recursos relacionados sejam removidos."
        : "Não foi possível excluir o usuário. Tente novamente.";
}

function formatRole(role) {
    switch (role) {
        case "owner":
            return "Dono";
        case "admin":
            return "Admin";
        case "user":
            return "Usuário";
        default:
            return "—";
    }
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
