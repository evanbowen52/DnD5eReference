// pages/spells.js
class SpellsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadSpells() {
        try {
            const spells = await this.api.fetch('spells');
            this.renderSpells(spells);
        } catch (error) {
            console.error('Error loading spells:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading spells</div>';
        }
    }

    renderSpells(spells) {
        this.container.innerHTML = `
            <h2>Spells (${spells.count})</h2>
            <div class="row">
                ${spells.results.map(spell => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${spell.name}</h5>
                                <p class="card-text">Level: ${spell.level}</p>
                                <p class="card-text">School: ${spell.school?.name}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/spells/${spell.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadSpellDetails(spellId) {
        try {
            const spell = await this.api.fetchById('spells', spellId);
            this.renderSpellDetails(spell);
        } catch (error) {
            console.error('Error loading spell details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading spell details</div>';
        }
    }

    renderSpellDetails(spell) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${spell.name}</h2>
                    <p><strong>Level:</strong> ${spell.level}</p>
                    <p><strong>School:</strong> ${spell.school?.name}</p>
                    <p><strong>Casting Time:</strong> ${spell.casting_time}</p>
                    <p><strong>Range:</strong> ${spell.range}</p>
                    <p><strong>Components:</strong> ${spell.components.join(', ')}</p>
                    <p><strong>Duration:</strong> ${spell.duration}</p>
                    <p><strong>Description:</strong></p>
                    <div>${spell.description.join('<br>')}</div>
                    ${spell.higher_level.length > 0 ? `
                        <p><strong>At Higher Levels:</strong></p>
                        <div>${spell.higher_level.join('<br>')}</div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Initialize the page
const spellsPage = new SpellsPage();

// Handle navigation
window.router.addRoute('/spells', () => spellsPage.loadSpells());
window.router.addRoute('/spells/:id', (params) => spellsPage.loadSpellDetails(params.id));