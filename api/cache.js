// api/cache.js

// Cache management
export class Cache {
    constructor() {
        this.storage = localStorage;
    }

    get(key) {
        const item = this.storage.getItem(key);
        if (!item) return null;

        const { data, timestamp } = JSON.parse(item);
        if (Date.now() - timestamp > this.getCacheDuration()) {
            this.remove(key);
            return null;
        }
        return data;
    }

    set(key, data) {
        this.storage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        Object.keys(this.storage)
            .filter(key => key.startsWith('dnd5e_'))
            .forEach(key => this.remove(key));
    }

    getCacheDuration() {
        return 24 * 60 * 60 * 1000; // 24 hours
    }
}

export const cache = new Cache();