import * as localStorage from "./localStorage.js";

const STORAGE_KEY = "scp_clients";

export function getAll() {
    return localStorage.getLocalData(STORAGE_KEY);
}

export function getById(id) {
    const clients = getAll();

    return clients.find(client => client.id === id) ?? null;
}

export function create(client) {
    const clients = getAll();

    const newClient = {
        id: localStorage.getNextId(STORAGE_KEY),
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
    };

    clients.push(newClient);
    localStorage.setLocalData(STORAGE_KEY, clients);

    return newClient;
}

export function update(id, data) {
    const clients = getAll();

    const index = clients.findIndex(client => client.id === id);

    if (index === -1) {
        return null;
    }

    clients[index] = {
        ...clients[index],
        ...data,
        id
    };

    localStorage.setLocalData(STORAGE_KEY, clients);

    return clients[index];
}

export function remove(id) {
    const clients = getAll();

    const index = clients.findIndex(client => client.id === id);

    if (index === -1) {
        return false;
    }

    clients.splice(index, 1);
    localStorage.setLocalData(STORAGE_KEY, clients);

    return true;
}
