// api/BasePage.js
export class BasePage {
    constructor() {
        this.state = {
            loading: false,
            error: null
        };
        this.cachedData = null;
    }

    setLoading(isLoading) {
        if (this.state.loading !== isLoading) {
            this.state.loading = isLoading;
            this.notifyStateChange();
        }
    }

    setError(error) {
        this.state.error = error;
        this.notifyStateChange();
    }

    clearError() {
        this.state.error = null;
        this.notifyStateChange();
    }

    notifyStateChange() {
        // Can be overridden by child classes
        console.log(`${this.constructor.name} state changed:`, this.state);
    }

    // Common error display method
    renderError(message) {
        return `
            <div class="alert alert-danger">
                ${message}
            </div>
        `;
    }
}