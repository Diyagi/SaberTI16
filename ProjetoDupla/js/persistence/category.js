import * as localStorage from "./localStorage.js";

const STORAGE_KEY = "scp_categories";

export function getAll() {
    return localStorage.getLocalData(STORAGE_KEY);
}

export function getById(id) {
    const categories = getAll();

    return categories.find(category => category.id === id) ?? null;
}

export function create(category) {
    const categories = getAll();

    const newCategory = {
        id: localStorage.getNextId(STORAGE_KEY),
        name: category.name,
        description: category.description
    };

    categories.push(newCategory);
    localStorage.setLocalData(STORAGE_KEY, categories);

    return newCategory;
}

export function update(id, data) {
    const categories = getAll();

    const index = categories.findIndex(category => category.id === id);

    if (index === -1) {
        return null;
    }

    categories[index] = {
        ...categories[index],
        ...data,
        id
    };

    localStorage.setLocalData(STORAGE_KEY, categories);

    return categories[index];
}

export function remove(id) {
    const categories = getAll();

    const index = categories.findIndex(category => category.id === id);

    if (index === -1) {
        return false;
    }

    categories.splice(index, 1);
    localStorage.setLocalData(STORAGE_KEY, categories);

    return true;
}
