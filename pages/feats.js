// pages/feats.js
class FeatsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadFeats() {
        try {
            const feats = await this.api.fetch('feats');
            this.renderFeats(feats);
        } catch (error) {
            console.error('Error loading feats:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading feats</div>';
        }
    }

    renderFeats(feats) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search feats..." 
                       oninput="featsPage.handleSearch(event)">
            </div>
            <h2>Feats (${feats.count})</h2>
            <div class="row" id="featsList">
                ${feats.results.map(feat => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${feat.name}</h5>
                                <p class="card-text">${feat.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/feats/${feat.index}')">
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
        const featsList = document.getElementById('featsList');
        const cards = featsList.querySelectorAll('.card');
        
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

    async loadFeatDetails(featId) {
        try {
            const feat = await this.api.fetchById('feats', featId);
            this.renderFeatDetails(feat);
        } catch (error) {
            console.error('Error loading feat details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading feat details</div>';
        }
    }

    renderFeatDetails(feat) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${feat.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${feat.desc}</p>
                    </div>
                    ${feat.prerequisites && feat.prerequisites.length > 0 ? `
                        <div class="mb-3">
                            <h4>Prerequisites</h4>
                            <ul>
                                ${feat.prerequisites.map(prereq => `
                                    <li>${prereq}</li>
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
const featsPage = new FeatsPage();

// Handle navigation
window.router.addRoute('/feats', () => featsPage.loadFeats());
window.router.addRoute('/feats/:id', (params) => featsPage.loadFeatDetails(params.id));