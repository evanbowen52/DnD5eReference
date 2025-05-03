// router.js
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '/';
        this.initialize();
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    navigate(path) {
        this.currentRoute = path;
        this.handleRoute();
        window.location.hash = path;
    }

    handleRoute() {
        const path = window.location.hash.slice(1) || '/';
        const route = this.routes[path];

        if (route) {
            const params = this.extractParams(path);
            route(params);
        } else {
            console.warn('No route found for:', path);
        }
    }

    extractParams(path) {
        const params = {};
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];

        if (lastPart.includes(':')) {
            const [key, value] = lastPart.split(':');
            params[key] = value;
        }

        return params;
    }

    initialize() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }
}

// Initialize the router
window.router = new Router();