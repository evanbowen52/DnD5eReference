// pages/subraces.js
class SubracesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadSubraces() {
        try {
            const subraces = await this.api.fetch('subraces');
            this.renderSubraces(subraces);
        } catch (error) {
            console.error('Error loading subraces:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading subraces</div>';
        }
    }

    renderSubraces(subraces) {
        this.container.innerHTML = `
            <h2>Subraces (${subraces.count})</h2>
            <div class="row">
                ${subraces.results.map(subrace => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${subrace.name}</h5>
                                <p class="card-text">Race: ${subrace.race.name}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/subraces/${subrace.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadSubraceDetails(subraceId) {
        try {
            const subrace = await this.api.fetchById('subraces', subraceId);
            this.renderSubraceDetails(subrace);
        } catch (error) {
            console.error('Error loading subrace details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading subrace details</div>';
        }
    }

    renderSubraceDetails(subrace) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${subrace.name}</h2>
                    <p><strong>Race:</strong> ${subrace.race.name}</p>
                    <div class="mt-3">
                        <h4>Features</h4>
                        ${subrace.racial_traits.map(trait => `
                            <div class="mb-3">
                                <h5>${trait.name}</h5>
                                <p>${trait.desc.join('<br>')}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-3">
                        <h4>Ability Score Increases</h4>
                        ${subrace.ability_bonuses.length > 0 ? `
                            <ul>
                                ${subrace.ability_bonuses.map(bonus => `
                                    <li><strong>${bonus.ability_score.name}:</strong> +${bonus.bonus}</li>
                                `).join('')}
                            </ul>
                        ` : '<p>No additional ability score increases</p>'}
                    </div>
                    <div class="mt-3">
                        <h4>Description</h4>
                        <p>${subrace.desc.join('<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the page
const subracesPage = new SubracesPage();

// Handle navigation
window.router.addRoute('/subraces', () => subracesPage.loadSubraces());
window.router.addRoute('/subraces/:id', (params) => subracesPage.loadSubraceDetails(params.id));