// pages/subclasses.js
class SubclassesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadSubclasses() {
        try {
            const subclasses = await this.api.fetch('subclasses');
            this.renderSubclasses(subclasses);
        } catch (error) {
            console.error('Error loading subclasses:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading subclasses</div>';
        }
    }

    renderSubclasses(subclasses) {
        this.container.innerHTML = `
            <h2>Subclasses (${subclasses.count})</h2>
            <div class="row">
                ${subclasses.results.map(subclass => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${subclass.name}</h5>
                                <p class="card-text">Class: ${subclass.class.name}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/subclasses/${subclass.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadSubclassDetails(subclassId) {
        try {
            const subclass = await this.api.fetchById('subclasses', subclassId);
            this.renderSubclassDetails(subclass);
        } catch (error) {
            console.error('Error loading subclass details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading subclass details</div>';
        }
    }

    renderSubclassDetails(subclass) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${subclass.name}</h2>
                    <p><strong>Class:</strong> ${subclass.class.name}</p>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <h4>Features</h4>
                            ${subclass.subclass_levels.map((level, index) => `
                                <div class="mb-3">
                                    <h5>Level ${index + 1}</h5>
                                    <ul>
                                        ${Object.entries(level).filter(([key]) => key !== 'level').map(([key, value]) => `
                                            <li><strong>${key.replace('_', ' ')}:</strong> ${value}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                        <div class="col-md-6">
                            <h4>Spells</h4>
                            ${subclass.spells.length > 0 ? `
                                <ul>
                                    ${subclass.spells.map(spell => `
                                        <li><a href="#/spells/${spell.index}">${spell.name}</a></li>
                                    `).join('')}
                                </ul>
                            ` : '<p>No spells associated with this subclass</p>'}
                        </div>
                    </div>
                    <div class="mt-3">
                        <h4>Description</h4>
                        <p>${subclass.desc.join('<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the page
const subclassesPage = new SubclassesPage();

// Handle navigation
window.router.addRoute('/subclasses', () => subclassesPage.loadSubclasses());
window.router.addRoute('/subclasses/:id', (params) => subclassesPage.loadSubclassDetails(params.id));