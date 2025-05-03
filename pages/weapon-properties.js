// pages/weapon-properties.js
class WeaponPropertiesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadWeaponProperties() {
        try {
            const properties = await this.api.fetch('weapon-properties');
            this.renderWeaponProperties(properties);
        } catch (error) {
            console.error('Error loading weapon properties:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading weapon properties</div>';
        }
    }

    renderWeaponProperties(properties) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search weapon properties..." 
                       oninput="weaponPropertiesPage.handleSearch(event)">
            </div>
            <h2>Weapon Properties (${properties.count})</h2>
            <div class="row" id="weaponPropertiesList">
                ${properties.results.map(prop => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${prop.name}</h5>
                                <p class="card-text">${prop.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/weapon-properties/${prop.index}')">
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
        const weaponPropertiesList = document.getElementById('weaponPropertiesList');
        const cards = weaponPropertiesList.querySelectorAll('.card');
        
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

    async loadWeaponPropertyDetails(propertyId) {
        try {
            const property = await this.api.fetchById('weapon-properties', propertyId);
            this.renderWeaponPropertyDetails(property);
        } catch (error) {
            console.error('Error loading weapon property details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading weapon property details</div>';
        }
    }

    renderWeaponPropertyDetails(property) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${property.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${property.desc}</p>
                    </div>
                    ${property.equipment_category ? `
                        <div class="mb-3">
                            <h4>Equipment Category</h4>
                            <p>${property.equipment_category.name}</p>
                        </div>
                    ` : ''}
                    ${property.weapon_category ? `
                        <div class="mb-3">
                            <h4>Weapon Category</h4>
                            <p>${property.weapon_category.name}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Initialize the page
const weaponPropertiesPage = new WeaponPropertiesPage();

// Handle navigation
window.router.addRoute('/weapon-properties', () => weaponPropertiesPage.loadWeaponProperties());
window.router.addRoute('/weapon-properties/:id', (params) => weaponPropertiesPage.loadWeaponPropertyDetails(params.id));