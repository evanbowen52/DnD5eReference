// router.js

class Router {
    constructor() {
        console.log('Router constructor called');
        this.routes = {};
        this.initialized = false;
        this.currentSpellsPage = null;
        
        // Initialize hash change listener
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
        // Mark as initialized after first route is added
        if (!this.initialized) {
            this.initialized = true;
            this.handleRoute();
        }
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        if (!this.initialized) {
            console.log('Router not initialized yet');
            return;
        }

        const hash = window.location.hash.slice(1) || '/spells';
        console.log('Current hash:', hash);

        // Check for exact match first
        if (this.routes[hash]) {
            console.log('Route found:', hash);
            this.routes[hash]();
            return;
        }

        // Check for pattern match (for /spells/:id)
        for (const [pattern, handler] of Object.entries(this.routes)) {
            if (pattern.includes(':id') && hash.startsWith('/spells/')) {
                const id = hash.split('/').pop();
                console.log('Route found:', pattern);
                if (window.router.currentSpellsPage) {
                    window.router.currentSpellsPage.loadSpellDetails({ id });
                } else {
                    const spellsPage = new window.SpellsPage();
                    window.router.currentSpellsPage = spellsPage;
                    spellsPage.loadSpellDetails({ id });
                }
                return;
            }
        }

        console.log('No route found, showing 404');
        this.show404();
    }

    show404() {
        const container = document.getElementById('mainContent');
        if (container) {
            container.innerHTML = `
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-6 text-center">
                            <h1>404 - Page Not Found</h1>
                            <p class="lead">The page you're looking for doesn't exist.</p>
                            <a href="#/spells" class="btn btn-primary">Go Home</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Export the Router class to the global scope
window.Router = Router;