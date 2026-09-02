import * as dbUser from "../soupabase/user.js"

export async function init() {
    //loadUsers();
}

async function loadUsers() {
    const { data, error } = await dbUser.getUsers();
    const tableBody = document.getElementById("usersTableBody");
    
    data.users.forEach(user => {
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
                    title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getFormatedRole(role) {
    switch (role) {
        case 'owner':
            return "Dono";
            break;
        case 'admin':
            return "Admin";
            break;
        case 'user':
            return "Usuario";
            break;
        default:
            return "";
            break;
    }
}