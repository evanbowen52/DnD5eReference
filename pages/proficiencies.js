// pages/proficiencies.js
class ProficienciesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadProficiencies() {
        try {
            const proficiencies = await this.api.fetch('proficiencies');
            this.renderProficiencies(proficiencies);
        } catch (error) {
            console.error('Error loading proficiencies:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading proficiencies</div>';
        }
    }

    renderProficiencies(proficiencies) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search proficiencies..." 
                       oninput="proficienciesPage.handleSearch(event)">
            </div>
            <h2>Proficiencies (${proficiencies.count})</h2>
            <div class="row" id="proficienciesList">
                ${proficiencies.results.map(prof => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${prof.name}</h5>
                                <p class="card-text">${prof.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/proficiencies/${prof.index}')">
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
        const proficienciesList = document.getElementById('proficienciesList');
        const cards = proficienciesList.querySelectorAll('.card');
        
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

    async loadProficiencyDetails(profId) {
        try {
            const prof = await this.api.fetchById('proficiencies', profId);
            this.renderProficiencyDetails(prof);
        } catch (error) {
            console.error('Error loading proficiency details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading proficiency details</div>';
        }
    }

    renderProficiencyDetails(prof) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${prof.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${prof.desc}</p>
                    </div>
                    ${prof.classes && prof.classes.length > 0 ? `
                        <div class="mb-3">
                            <h4>Classes</h4>
                            <ul>
                                ${prof.classes.map(cls => `
                                    <li>${cls.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${prof.races && prof.races.length > 0 ? `
                        <div class="mb-3">
                            <h4>Races</h4>
                            <ul>
                                ${prof.races.map(race => `
                                    <li>${race.name}</li>
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
const proficienciesPage = new ProficienciesPage();

// Handle navigation
window.router.addRoute('/proficiencies', () => proficienciesPage.loadProficiencies());
window.router.addRoute('/proficiencies/:id', (params) => proficienciesPage.loadProficiencyDetails(params.id));