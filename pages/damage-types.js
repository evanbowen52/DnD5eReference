// pages/damage-types.js
class DamageTypesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadDamageTypes() {
        try {
            const damageTypes = await this.api.fetch('damage-types');
            this.renderDamageTypes(damageTypes);
        } catch (error) {
            console.error('Error loading damage types:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading damage types</div>';
        }
    }

    renderDamageTypes(damageTypes) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search damage types..." 
                       oninput="damageTypesPage.handleSearch(event)">
            </div>
            <h2>Damage Types (${damageTypes.count})</h2>
            <div class="row" id="damageTypesList">
                ${damageTypes.results.map(type => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${type.name}</h5>
                                <p class="card-text">${type.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/damage-types/${type.index}')">
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
        const damageTypesList = document.getElementById('damageTypesList');
        const cards = damageTypesList.querySelectorAll('.card');
        
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

    async loadDamageTypeDetails(typeId) {
        try {
            const type = await this.api.fetchById('damage-types', typeId);
            this.renderDamageTypeDetails(type);
        } catch (error) {
            console.error('Error loading damage type details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading damage type details</div>';
        }
    }

    renderDamageTypeDetails(type) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${type.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${type.desc}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

window.DamageTypesPage = DamageTypesPage;