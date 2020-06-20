function get(key) {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch (error) {
        // no localstorage or user.
    }
}

function set(key, value) {
    if (localStorage)
        localStorage.setItem(key, JSON.stringify(value));
}

function remove(key) {
    localStorage.removeItem(key);
}

module.exports = {
    localStorage: {
        get,

        set,

        remove,
    }
}