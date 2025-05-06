// api/client.js
// Simple cache implementation
const cache = {
    store: {},
    
    get(key) {
        return this.store[key];
    },
    
    set(key, value) {
        this.store[key] = value;
        return value;
    },
    
    clear() {
        this.store = {};
    },
    
    has(key) {
        return key in this.store;
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
            features: '/api/features',
            proficiencies: '/api/proficiencies',
            equipment: '/api/equipment',
            'equipment-categories': '/api/equipment-categories',
            'magic-items': '/api/magic-items',
            'weapon-properties': '/api/weapon-properties',
            'ability-scores': '/api/ability-scores',
            skills: '/api/skills',
            'damage-types': '/api/damage-types',
            conditions: '/api/conditions',
            'magic-schools': '/api/magic-schools',
            rules: '/api/rules',
            'rule-sections': '/api/rule-sections'
        };
    }

    /**
     * Generic fetch method
     * @param {string} endpoint - The API endpoint to fetch from
     * @param {Object} [options] - Fetch options
     * @returns {Promise<any>} The JSON response
     */
    async fetch(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = `${endpoint}${JSON.stringify(options)}`;
        
        // Return cached response if available
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`API request failed for ${url}:`, error);
            throw error;
        }
    }

    /**
     * Fetch a list of items of a specific type
     * @param {string} type - The type of items to fetch (e.g., 'spells', 'classes')
     * @param {Object} [params] - Query parameters
     * @returns {Promise<Object>} The list of items
     */
    async fetchList(type, params = {}) {
        if (!this.endpoints[type]) {
            throw new Error(`Unknown resource type: ${type}`);
        }
        
        const query = new URLSearchParams(params).toString();
        const endpoint = query 
            ? `${this.endpoints[type]}?${query}`
            : this.endpoints[type];
            
        return this.fetch(endpoint);
    }

    /**
     * Fetch a single item by its index
     * @param {string} type - The type of the item
     * @param {string} index - The item's index
     * @returns {Promise<Object>} The item data
     */
    async fetchByIndex(type, index) {
        if (!this.endpoints[type]) {
            throw new Error(`Unknown resource type: ${type}`);
        }
        return this.fetch(`${this.endpoints[type]}/${index}`);
    }

    /**
     * Search for items
     * @param {string} type - The type of items to search
     * @param {Object} query - Search parameters
     * @returns {Promise<Object>} Search results
     */
    async search(type, query = {}) {
        return this.fetchList(type, query);
    }

    // Specific methods for common resources
    async getSpells() {
        return this.fetchList('spells');
    }

    async getSpellByIndex(index) {
        return this.fetchByIndex('spells', index);
    }

    async getClasses() {
        return this.fetchList('classes');
    }

    async getClassByIndex(index) {
        return this.fetchByIndex('classes', index);
    }

    async getMonsters() {
        return this.fetchList('monsters');
    }

    async getMonsterByIndex(index) {
        return this.fetchByIndex('monsters', index);
    }

    // Clear the cache
    clearCache() {
        this.cache.clear();
    }
}

// Export a singleton instance
const api = new DnDAPI();
export { api, DnDAPI };