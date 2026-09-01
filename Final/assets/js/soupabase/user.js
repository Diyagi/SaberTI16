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
