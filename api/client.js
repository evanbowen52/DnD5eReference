// client.js
// Include axios from CDN
const axios = window.axios;

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
        this.endpoints = {
            spells: '/api/spells',
            monsters: '/api/monsters',
            classes: '/api/classes',
            subclasses: '/api/subclasses',
            races: '/api/races',
            subraces: '/api/subraces',
            equipment: '/api/equipment',
            rules: '/api/rules',
            'rule-sections': '/api/rule-sections'
        };
    }

    async fetch(endpoint) {
        console.log('Fetching:', endpoint);
        try {
            const response = await axios.get(`${this.baseURL}/api/${endpoint}`);
            console.log('API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }

    async fetchById(endpoint, id) {
        try {
            const response = await axios.get(`${this.baseURL}${this.endpoints[endpoint]}/${id}`);
            this.cache.set(`${endpoint}_${id}`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} by ID:`, error);
            throw error;
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

// Create and export the API instance to the global scope
window.api = new DnDAPI();