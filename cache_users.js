// Caches Setup

let cached_users = new Map();

cached_users.set('DEFAULT', require('./defaults/user.js'));


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
    get(id) {
        return cached_users.get(id);
    },
    get_cache(){
        return cached_users;
    }
};