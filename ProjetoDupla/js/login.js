import * as userData from "./persistence/users.js";

document.addEventListener("DOMContentLoaded", () => {
    const userEmailInput = document.getElementById("userMail");
    const userPassInput = document.getElementById("userPass");
    const loginForm = document.getElementById("loginForm");
    
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const userEmailValue = userEmailInput.value;
        const userPassValue = userPassInput.value;
        
        const user = await userData.getByAuth(userEmailValue, userPassValue);
        
        if (!user) {
            alert("Usuario ou senha incorretos!");
            return;
        }
        
        sessionStorage.setItem("loggedInUserId", user.id);
        window.location.href="menu.html"

    });
});
