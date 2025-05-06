// api/stateManager.js
class StateManager {
    constructor() {
      this.state = {
        currentPage: null,
        loading: false,
        loadedPages: new Set(),
        cache: {
          // Cache structure: { data: any, timestamp: number }
          spells: new Map(),
          classes: new Map(),
          // Add more caches as needed
        }
      };
      this.init();
    }
  
    init() {
      // Load session state if available
      const savedState = sessionStorage.getItem('appState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          this.state.loadedPages = new Set(parsed.loadedPages || []);
        } catch (e) {
          console.error('Failed to parse saved state:', e);
        }
      }
    }
  
    markPageLoaded(page) {
      this.state.loadedPages.add(page);
      this.saveState();
    }
  
    isPageLoaded(page) {
      return this.state.loadedPages.has(page);
    }
  
    clear() {
      this.state.loadedPages.clear();
      this.state.cache.spells.clear();
      this.state.cache.classes.clear();
      this.saveState();
    }
  
    setLoading(loading) {
      this.state.loading = loading;
    }
  
    isLoading() {
      return this.state.loading;
    }
  
    setCurrentPage(page) {
      this.state.currentPage = page;
    }
  
    getCurrentPage() {
      return this.state.currentPage;
    }
  
    // Cache methods
    setCache(category, key, data) {
      if (!this.state.cache[category]) {
        this.state.cache[category] = new Map();
      }
      this.state.cache[category].set(key, {
        data,
        timestamp: Date.now()
      });
    }
  
    getCache(category, key) {
      if (!this.state.cache[category]) return null;
      const cached = this.state.cache[category].get(key);
      return cached ? cached.data : null;
    }
  
    clearCache(category = null) {
      if (category) {
        if (this.state.cache[category]) {
          this.state.cache[category].clear();
        }
      } else {
        Object.values(this.state.cache).forEach(cache => cache.clear());
      }
    }
  
    saveState() {
      try {
        const stateToSave = {
          loadedPages: Array.from(this.state.loadedPages),
          // Add other state properties that should persist
        };
        sessionStorage.setItem('appState', JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    }
  }
  
  // Export a singleton instance
  const stateManager = new StateManager();
  export { stateManager };