// pages/traits.js
class TraitsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadTraits() {
        try {
            const traits = await this.api.fetch('traits');
            this.renderTraits(traits);
        } catch (error) {
            console.error('Error loading traits:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading traits</div>';
        }
    }

    renderTraits(traits) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search traits..." 
                       oninput="traitsPage.handleSearch(event)">
            </div>
            <h2>Traits (${traits.count})</h2>
            <div class="row" id="traitsList">
                ${traits.results.map(trait => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${trait.name}</h5>
                                <p class="card-text">${trait.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/traits/${trait.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const traitsList = document.getElementById('traitsList');
        const cards = traitsList.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const text = card.querySelector('.card-text').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || text.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    async loadTraitDetails(traitId) {
        try {
            const trait = await this.api.fetchById('traits', traitId);
            this.renderTraitDetails(trait);
        } catch (error) {
            console.error('Error loading trait details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading trait details</div>';
        }
    }

    renderTraitDetails(trait) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${trait.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${trait.desc}</p>
                    </div>
                    ${trait.races && trait.races.length > 0 ? `
                        <div class="mb-3">
                            <h4>Races</h4>
                            <ul>
                                ${trait.races.map(race => `
                                    <li>${race.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${trait.classes && trait.classes.length > 0 ? `
                        <div class="mb-3">
                            <h4>Classes</h4>
                            <ul>
                                ${trait.classes.map(cls => `
                                    <li>${cls.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Initialize the page
const traitsPage = new TraitsPage();

// Handle navigation
window.router.addRoute('/traits', () => traitsPage.loadTraits());
window.router.addRoute('/traits/:id', (params) => traitsPage.loadTraitDetails(params.id));