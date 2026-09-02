import { supabase } from "./supaCliente.js"

export function registerUser() {
    
}

export async function authUser(email, password) {
    return await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
}

export async function getUser() {
    return supabase.auth.getUser();
}

export async function getUsers() {
    return await supabase.functions.invoke("getUsers");
}

export async function updateUser(userId, data) {
    return null
// await supabase.functions.invoke("update-user", {
//   body: {
//     userId: targetUserId,
//     email: "new@email.com",
//     username: "newusername",
//     fullname: "John Smith",
//     password: "new-password-123",
//     user_role: "admin",
//   },
// });
}
