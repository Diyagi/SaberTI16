import { supabase } from "./supaCliente.js";

export function registerUser() {}

export async function authUser(email, password) {
	return await supabase.auth.signInWithPassword({
		email: email,
		password: password,
	});
}

export async function getLoggedUser() {
	return supabase.auth.getUser();
}

export async function getUser(userId) {
	return await supabase.functions.invoke(`getUsers?userId=${userId}`);
}

export async function getUsers() {
	return await supabase.functions.invoke("getUsers");
}

export async function updateUser(data) {
	return await supabase.functions.invoke("updateUser", {
	  body: { ...data }
	});
}
