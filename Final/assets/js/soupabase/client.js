import { supabase } from "./supaCliente.js";

export async function getClients() {
    return await supabase
        .from("client")
        .select()
        .order("id");
}

export async function getClient(clientId) {
    return await supabase
        .from("client")
        .select()
        .eq("id", clientId)
        .single();
}

export async function createClient(data) {
    return await supabase
        .from("client")
        .insert(data)
        .select()
        .single();
}

export async function updateClient(clientId, data) {
    return await supabase
        .from("client")
        .update(data)
        .eq("id", clientId)
        .select()
        .single();
}

export async function deleteClient(clientId) {
    return await supabase
        .from("client")
        .delete()
        .eq("id", clientId);
}
