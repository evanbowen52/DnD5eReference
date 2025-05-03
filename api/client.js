// client.js
// Include axios from CDN
const axios = window.axios;

// API configuration
const API_ENDPOINTS = {
    spells: '/api/spells',
    monsters: '/api/monsters',
    // Add other endpoints as needed
};

// Cache implementation
const cache = {
    store: {},
    
    get(key) {
        return this.store[key];
    },
    
    set(key, value) {
        this.store[key] = value;
    },
    
    clear() {
        this.store = {};
    }
};

// API client class
class DnDAPI {
    constructor() {
        this.baseURL = 'https://www.dnd5eapi.co';
        this.cache = cache;
    }

    async fetch(endpoint, params = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
        const cachedData = this.cache.get(cacheKey);
        
        if (cachedData) {
            return cachedData;
        }

        try {
            const response = await axios.get(`${this.baseURL}${API_ENDPOINTS[endpoint]}`, {
                params
            });
            const data = response.data;
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async fetchById(endpoint, id) {
        return this.fetch(endpoint, { index: id });
    }

    clearCache() {
        this.cache.clear();
    }
}

// Create and export the API instance to the global scope
window.api = new DnDAPI();