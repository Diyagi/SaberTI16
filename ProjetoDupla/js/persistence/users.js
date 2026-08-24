import * as localStorage from "./localStorage.js";

const STORAGE_KEY = "scp_users";

export function getAll() {
    return localStorage.getLocalData(STORAGE_KEY);
}

export function getById(id) {
    const users = getAll();
    
    return users.find(user => user.id === id) ?? null;
}

export async function getByAuth(email, pass) {
    const users = getAll();
    const passwordHash = await hash(pass)
    
    return users.find(user => user.email === email && 
        user.password === passwordHash) ?? null;
}

export async function create(user) {
    const users = getAll();
    
    if (users.some(u => u.username === user.username)) {
        throw new Error("Esse nome de usuário já está em uso.");
    }
    
    if (users.some(u => u.email === user.email)) {
        throw new Error("Esse e-mail já está cadastrado.");
    }
    
    const passwordHash = await hash(user.password);
    
    const newuser = {
        id: localStorage.getNextId(STORAGE_KEY),
        name: user.name,
        username: user.username,
        email: user.email,
        password: passwordHash
    };
    
    users.push(newuser);
    localStorage.setLocalData(STORAGE_KEY, users);
    
    return newuser;
}

export async function updatePassword(id, password) {
    const users = getAll();
    const passwordHash = await hash(password);
    
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
        return false;
    }
    
    users[index].password = passwordHash;
    
    localStorage.setLocalData(STORAGE_KEY, users);
    
    return true;
}

export function update(id, data) {
    const users = getAll();
    
    if (data.username !== undefined && 
        users.some(u => u.username === data.username && u.id !== id)
    ) {
        throw new Error("Username already exists.");
    }
    
    if (data.email !== undefined &&
        users.some(u => u.email === data.email && u.id !== id)
    ) {
        throw new Error("Email already exists.");
    }
    
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
        return null;
    }
    
    const { password, ...userData } = data;
    
    users[index] = {
        ...users[index],
        ...userData,
        id
    };
    
    localStorage.setLocalData(STORAGE_KEY, users);
    
    return users[index];
}

export function remove(id) {
    const users = getAll();
    
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
        return false;
    }
    
    users.splice(index, 1);
    localStorage.setLocalData(STORAGE_KEY, users);
    
    return true;
}

async function hash(value) {
    const data = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    
    return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}
