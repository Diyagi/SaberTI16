import * as userData from "./persistence/users.js"

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("userMail");
    const newPassInput = document.getElementById("newPass");
    const newPassConfirmInput = document.getElementById("newPassConfirm");
    const passRecForm = document.getElementById("passRecForm");

    passRecForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newPass = newPassInput.value === newPassConfirmInput.value ? newPassInput.value : null;
        const user = await userData.getByEmail(emailInput.value);

        if (!newPass) {
            alert("As senhas não coincidem!");
            return;
        }

        if (!user) {
            alert("Email Inexistente!");
            return;
        }

        userData.updatePassword(user.id, newPass);
        alert("Senha Alterada!");
        window.location.href="login.html";
    })
});
