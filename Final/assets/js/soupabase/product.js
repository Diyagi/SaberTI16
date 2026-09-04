import { supabase } from "./supaCliente.js";

export async function getProducts() {
    return await supabase
        .from("product")
        .select("id, description, price, status, observation, created_at, category:categoryid(id, description)")
        .order("id");
}

export async function getProduct(productId) {
    return await supabase
        .from("product")
        .select()
        .eq("id", productId)
        .single();
}

export async function createProduct(data) {
    return await supabase
        .from("product")
        .insert(data)
        .select()
        .single();
}

export async function updateProduct(productId, data) {
    return await supabase
        .from("product")
        .update(data)
        .eq("id", productId)
        .select()
        .single();
}

export async function deleteProduct(productId) {
    return await supabase
        .from("product")
        .delete()
        .eq("id", productId);
}
