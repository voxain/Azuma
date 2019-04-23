// Caches Setup

let cached_channels = new Map();


module.exports = {
    set(id, data) {
        return cached_channels.set(id, data);
    },
    delete(id) {
        return cached_channels.delete(id);
    },
    has(id) {
        return cached_channels.has(id);
    },
    filter(f) {
        for (const [key, val] of cached_channels) {
            if (f(val)) return val;
        }
        return null;
    },
    get(id) {
        return cached_channels.get(id);
    },
    get_cache(){
        return cached_channels;
    }
};