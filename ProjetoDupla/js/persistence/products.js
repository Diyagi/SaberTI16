import * as localStorage from "./localStorage.js";

const STORAGE_KEY = "scp_products";

export function getAll() {
    return localStorage.getLocalData(STORAGE_KEY);
}

export function getById(id) {
    const products = getAll();

    return products.find(product => product.id === id) ?? null;
}

export function create(product) {
    const products = getAll();

    const newProduct = {
        id: localStorage.getNextId(STORAGE_KEY),
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        categoryId: product.categoryId,
        price: product.price
    };

    products.push(newProduct);
    localStorage.setLocalData(STORAGE_KEY, products);

    return newProduct;
}

export function update(id, data) {
    const products = getAll();

    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        return null;
    }

    products[index] = {
        ...products[index],
        ...data,
        id
    };

    localStorage.setLocalData(STORAGE_KEY, products);

    return products[index];
}

export function remove(id) {
    const products = getAll();

    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        return false;
    }

    products.splice(index, 1);
    localStorage.setLocalData(STORAGE_KEY, products);

    return true;
}
