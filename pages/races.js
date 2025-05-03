// pages/races.js
class RacesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadRaces() {
        try {
            const races = await this.api.fetch('races');
            this.renderRaces(races);
        } catch (error) {
            console.error('Error loading races:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading races</div>';
        }
    }

    renderRaces(races) {
        this.container.innerHTML = `
            <h2>Races (${races.count})</h2>
            <div class="row">
                ${races.results.map(race => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${race.name}</h5>
                                <p class="card-text">Speed: ${race.speed}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/races/${race.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadRaceDetails(raceId) {
        try {
            const race = await this.api.fetchById('races', raceId);
            this.renderRaceDetails(race);
        } catch (error) {
            console.error('Error loading race details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading race details</div>';
        }
    }

    renderRaceDetails(race) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${race.name}</h2>
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Basic Information</h4>
                            <ul>
                                <li><strong>Speed:</strong> ${race.speed}</li>
                                <li><strong>Age:</strong> ${race.age}</li>
                                <li><strong>Size:</strong> ${race.size}</li>
                                <li><strong>Alignment:</strong> ${race.alignment}</li>
                                <li><strong>Languages:</strong> ${race.languages.map(lang => lang.name).join(', ')}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h4>Ability Score Increases</h4>
                            <ul>
                                ${race.ability_bonuses.map(bonus => `
                                    <li><strong>${bonus.ability_score.name}:</strong> +${bonus.bonus}</li>
                                `).join('')}
                            </ul>
                            <h4>Subraces</h4>
                            ${race.subraces.length > 0 ? `
                                <ul>
                                    ${race.subraces.map(subrace => `
                                        <li><a href="#/subraces/${subrace.index}">${subrace.name}</a></li>
                                    `).join('')}
                                </ul>
                            ` : '<p>No subraces</p>'}
                        </div>
                    </div>
                    <div class="mt-3">
                        <h4>Features</h4>
                        ${race.racial_traits.map(trait => `
                            <div class="mb-3">
                                <h5>${trait.name}</h5>
                                <p>${trait.desc.join('<br>')}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-3">
                        <h4>Description</h4>
                        <p>${race.desc.join('<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the page
const racesPage = new RacesPage();

// Handle navigation
window.router.addRoute('/races', () => racesPage.loadRaces());
window.router.addRoute('/races/:id', (params) => racesPage.loadRaceDetails(params.id));