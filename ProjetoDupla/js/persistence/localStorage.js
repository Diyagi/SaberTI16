export function getLocalData(key) {
    const data = localStorage.getItem(key);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

export function setLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getNextId(key) {
    const data = getLocalData(key);

    if (data.length === 0) {
        return 1;
    }

    return Math.max(...data.map(item => item.id)) + 1;
}
