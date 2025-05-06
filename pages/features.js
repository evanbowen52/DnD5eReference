// pages/features.js
class FeaturesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadFeatures() {
        try {
            const features = await this.api.fetch('features');
            this.renderFeatures(features);
        } catch (error) {
            console.error('Error loading features:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading features</div>';
        }
    }

    renderFeatures(features) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search features..." 
                       oninput="featuresPage.handleSearch(event)">
            </div>
            <h2>Features (${features.count})</h2>
            <div class="row" id="featuresList">
                ${features.results.map(feature => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${feature.name}</h5>
                                <p class="card-text">${feature.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/features/${feature.index}')">
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
        const featuresList = document.getElementById('featuresList');
        const cards = featuresList.querySelectorAll('.card');
        
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

    async loadFeatureDetails(featureId) {
        try {
            const feature = await this.api.fetchById('features', featureId);
            this.renderFeatureDetails(feature);
        } catch (error) {
            console.error('Error loading feature details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading feature details</div>';
        }
    }

    renderFeatureDetails(feature) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${feature.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${feature.desc}</p>
                    </div>
                    ${feature.references && feature.references.length > 0 ? `
                        <div class="mb-3">
                            <h4>References</h4>
                            <ul>
                                ${feature.references.map(ref => `
                                    <li>
                                        <strong>${ref.name}</strong>
                                        <p>${ref.desc}</p>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

window.FeaturesPage = FeaturesPage;