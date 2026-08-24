import * as userData from "./persistence/users.js"
import { initRouter } from "./router.js";
import { showConfirmation } from "./confirmationModal.js";

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserName = document.getElementById("loggedInUserName");
    const logoutButton = document.getElementById("logoutButton");

    const loggedInUserId = Number(sessionStorage.getItem("loggedInUserId"));
    if (!loggedInUserId) {
        window.location.href = "login.html";
        return;
    }

    const loggedInUser = userData.getById(loggedInUserId);
    loggedInUserName.textContent = loggedInUser ? loggedInUser.name : "Desconhecido"

    logoutButton.addEventListener("click", () => {
        showConfirmation("Tem certeza que deseja sair?", () => {
        sessionStorage.removeItem("loggedInUserId");
        window.location.href = "login.html";
        });
    });

    initRouter();
})