import * as dbUser from "../../soupabase/user.js";
import { confirmModal } from "../../../../components/confirmationModal.js";

export async function init() {
	loadUsers();
}

async function loadUsers() {
	const { data, error } = await dbUser.getUsers();
	const tableBody = document.getElementById("usersTableBody");
    tableBody.innerHTML = '';

	data.users.forEach((user) => {
		const profile = user.profile;

		const row = document.createElement("tr");

		row.innerHTML = `
            <td>${user.email}</td>
            <td>${profile?.username ?? ""}</td>
            <td>${profile?.full_name ?? ""}</td>
            <td>
                <span class="badge text-bg-secondary">
                    ${getFormatedRole(profile?.user_role)}
                </span>
            </td>
            <td class="text-end">
                <button 
                    class="btn btn-sm btn-warning edit-user"
                    data-id="${user.id}"
                    title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
        
                <button 
                    class="btn btn-sm btn-danger delete-user"
                    data-id="${user.id}"
                    data-name="${profile?.full_name ?? "Desconhecido"}"
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

	const editBtn = target.closest(".edit-user");
	if (editBtn) {
		window.location.href = `/menu/users/edit?userId=${editBtn.dataset.id}`;
		return;
	}

	const deleteBtn = target.closest(".delete-user");
	if (deleteBtn) {
		confirmModal({
			title: "Deletar Usuario",
			message: `Tem certeza que deseja deletar o usuario <b>${deleteBtn.dataset.name}</b>?`,
			confirmText: "Deletar",
			onConfirm: async () => {
				await dbUser.deleteUser(deleteBtn.dataset.id);
				loadUsers();
			},
		});
		return;
	}
}

function getFormatedRole(role) {
	switch (role) {
		case "owner":
			return "Dono";
		case "admin":
			return "Admin";
		case "user":
			return "Usuario";
		default:
			return "";
	}
}
