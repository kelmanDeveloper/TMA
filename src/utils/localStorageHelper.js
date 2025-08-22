// utils/localStorageHelper.js
export function updateTimestamp(key, timestamp) {
    if (!timestamp) {
        return;
    }
    const timestamps = JSON.parse(localStorage.getItem("updateTimestamps")) || {};
    timestamps[key] = timestamp;
    localStorage.setItem("updateTimestamps", JSON.stringify(timestamps));
}

export function getTimestamp(key) {
    const timestamps = JSON.parse(localStorage.getItem("updateTimestamps")) || {};
    return timestamps[key] || null;
}

export function getAllTimestamps() {
    return JSON.parse(localStorage.getItem("updateTimestamps")) || {};
}
