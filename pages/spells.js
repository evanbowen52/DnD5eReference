// pages/spells.js
import { api } from '../api/client.js';

class SpellsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.state = {
            loading: false,
            spells: [],
            currentSpell: null,
            filteredSpells: []
        };
    }

    async init() {
        this.state.loading = true;
        this.renderLoading();
        
        try {
            const data = await api.fetchList('spells');
            this.state.spells = data.results || [];
            this.state.filteredSpells = [...this.state.spells];
            this.renderSpells();
        } catch (error) {
            console.error('Error loading spells:', error);
            this.renderError();
        } finally {
            this.state.loading = false;
        }
    }

    async showSpellDetails(spellIndex) {
        this.state.loading = true;
        this.renderLoading();

        try {
            this.state.currentSpell = await api.fetchByIndex('spells', spellIndex);
            this.renderSpellDetails();
        } catch (error) {
            console.error('Error loading spell details:', error);
            this.renderError();
        } finally {
            this.state.loading = false;
        }
    }

    renderLoading() {
        this.container.innerHTML = `
            <div class="loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p>Loading spells...</p>
            </div>
        `;
    }

    renderError() {
        this.container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load spells. Please try again later.
                <button class="btn btn-link" onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }

    renderSpells() {
        this.container.innerHTML = `
            <div class="spells-container">
                <h1>D&D 5e Spells</h1>
                
                <div class="search-container mb-4">
                    <input 
                        type="text" 
                        id="spellSearch" 
                        class="form-control" 
                        placeholder="Search spells..." 
                        oninput="window.spellsPage.filterSpells(this.value)"
                    >
                </div>
                
                <div class="spells-list row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${this.state.filteredSpells.map(spell => `
                        <div class="col">
                            <div class="card spell-card h-100" onclick="window.spellsPage.showSpellDetails('${spell.index}')">
                                <div class="card-body">
                                    <h5 class="card-title">${spell.name}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">${spell.level > 0 ? `Level ${spell.level}` : 'Cantrip'}</h6>
                                    <p class="card-text">
                                        <small>${spell.school.name} • ${spell.components.join(', ')}</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    filterSpells(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.state.filteredSpells = this.state.spells.filter(spell => 
            spell.name.toLowerCase().includes(term)
        );
        this.renderSpells();
    }

    renderSpellDetails() {
        const spell = this.state.currentSpell;
        if (!spell) return;

        this.container.innerHTML = `
            <div class="spell-details">
                <a href="#/spells" class="btn btn-outline-secondary mb-4">
                    <i class="bi bi-arrow-left"></i> Back to Spells
                </a>
                
                <div class="card">
                    <div class="card-header">
                        <h1>${spell.name}</h1>
                        <div class="spell-meta">
                            <span class="badge bg-primary">${spell.level > 0 ? `Level ${spell.level}` : 'Cantrip'}</span>
                            <span class="badge bg-secondary">${spell.school.name}</span>
                            <span class="badge bg-info">${spell.components.join(', ')}</span>
                            ${spell.concentration ? '<span class="badge bg-warning">Concentration</span>' : ''}
                            ${spell.ritual ? '<span class="badge bg-success">Ritual</span>' : ''}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="spell-info">
                            <p><strong>Casting Time:</strong> ${spell.casting_time}</p>
                            <p><strong>Range:</strong> ${spell.range}</p>
                            <p><strong>Duration:</strong> ${spell.duration}</p>
                            ${spell.material ? `<p><strong>Materials:</strong> ${spell.material}</p>` : ''}
                        </div>
                        
                        <div class="spell-description">
                            ${spell.desc.map(desc => `<p>${desc}</p>`).join('')}
                            
                            ${spell.higher_level && spell.higher_level.length > 0 ? `
                                <h4>At Higher Levels</h4>
                                ${spell.higher_level.map(desc => `<p>${desc}</p>`).join('')}
                            ` : ''}
                            
                            ${spell.damage ? `
                                <h4>Damage</h4>
                                <p>${spell.damage.damage_type.name}: ${spell.damage.damage_at_character_level ? 
                                    Object.entries(spell.damage.damage_at_character_level)
                                        .map(([level, dmg]) => `Level ${level}: ${dmg}`)
                                        .join(', ')
                                    : spell.damage.damage_at_slot_level ? 
                                        Object.entries(spell.damage.damage_at_slot_level)
                                            .map(([level, dmg]) => `Level ${level}: ${dmg}`)
                                            .join(', ')
                                    : 'Varies'}</p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Create and expose instance
const spellsPage = new SpellsPage();
window.spellsPage = spellsPage;

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#/spells/')) {
        const spellIndex = hash.split('/')[2];
        spellsPage.showSpellDetails(spellIndex);
    } else if (hash === '#/spells') {
        spellsPage.init();
    }
});

// Initialize if on spells page
if (window.location.hash.startsWith('#/spells')) {
    if (window.location.hash === '#/spells') {
        spellsPage.init();
    } else {
        const spellIndex = window.location.hash.split('/')[2];
        spellsPage.showSpellDetails(spellIndex);
    }
}

export default SpellsPage;