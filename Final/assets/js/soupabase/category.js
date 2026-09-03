import { supabase } from "./supaCliente.js";

export async function createCategory(data) {
    return await supabase
        .from("category")
        .insert({...data})
        .select();
}

export async function getCategories() {
    return await supabase
	    .from("category")
	    .select();
}

export async function getCategory(categoryId) {
    return await supabase
        .from("category")
        .select()
        .eq("id", categoryId)
        .single();
}

export async function updateCategory(categoryId, data) {
    return await supabase
        .from("category")
        .update({...data})
        .eq("id", categoryId);
}

export async function deleteCategory(categoryId) {
    return await supabase
        .from("category")
        .delete()
        .eq("id", categoryId);
}
