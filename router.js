// router.js
class Router {
    constructor() {
        this.routes = {};
        console.log('Router constructor called');
    }

    addRoute(pattern, handler) {
        console.log('Adding route:', pattern);
        this.routes[pattern] = handler;
    }

    navigate(path) {
        console.log('Navigating to:', path);
        window.location.hash = path;
        this.handleRoute();
    }

    handleRoute() {
        console.log('Handling route...');
        const hash = window.location.hash.slice(1) || '/';
        console.log('Current hash:', hash);
        
        const route = Object.keys(this.routes).find(pattern => {
            const regex = pattern
                .replace(/:[^\/]+/g, '([^/]+)')
                .replace(/\/$/, '') + '$';
            return new RegExp(regex).test(hash);
        });

        if (route) {
            console.log('Route found:', route);
            const handler = this.routes[route];
            const params = this.extractParams(route, hash);
            console.log('Route params:', params);
            handler(params);
        } else {
            console.error('No route found for:', hash);
        }
    }

    extractParams(pattern, hash) {
        const regex = pattern
            .replace(/:[^\/]+/g, '([^/]+)')
            .replace(/\/$/, '') + '$';
        const matches = hash.match(new RegExp(regex));
        if (!matches) return {};
        
        const params = {};
        const paramNames = pattern.match(/:[^\/]+/g);
        if (paramNames) {
            paramNames.forEach((name, i) => {
                params[name.slice(1)] = matches[i + 1];
            });
        }
        return params;
    }
}

// Initialize the router
window.router = new Router();