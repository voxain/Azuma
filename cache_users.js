// Caches Setup

let cached_users = new Map();


module.exports = {
    set(id, data) {
        return cached_users.set(id, data);
    },
    delete(id) {
        return cached_users.delete(id);
    },
    has(id) {
        return cached_users.has(id);
    },
    filter(f) {
        for (const [key, val] of cached_users) {
            if (f(val)) return val;
        }
        return null;
    },
    get(id) {
        return cached_users.get(id);
    },
    get_cache(){
        return cached_users;
    }
};