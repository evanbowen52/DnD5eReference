// pages/spells.js
class SpellsPage {
    constructor() {
        console.log('SpellsPage constructor called');
        this.container = document.getElementById('spells-container');
        if (!this.container) {
            console.error('Spells container not found');
            // Create the container if it doesn't exist
            this.container = document.createElement('div');
            this.container.id = 'spells-container';
            document.getElementById('mainContent').appendChild(this.container);
        }
        this.api = new DnDAPI();
        console.log('SpellsPage initialized');
    }

    async loadSpells() {
        console.log('loadSpells called');
        try {
            const spells = await this.api.fetch('spells');
            console.log('Spells fetched successfully:', spells);
            
            // Fetch detailed information for each spell
            const detailedSpells = await Promise.all(
                spells.results.map(async (spell) => {
                    const detailedSpell = await this.api.fetchById('spells', spell.index);
                    return {
                        ...spell,
                        ...detailedSpell
                    };
                })
            );
            
            this.renderSpells({
                count: spells.count,
                results: detailedSpells
            });
        } catch (error) {
            console.error('Error loading spells:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading spells</div>';
        }
    }

    renderSpells(spells) {
        console.log('renderSpells called with', spells);
        if (!spells || !spells.results) {
            console.error('Invalid spells data:', spells);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading spells data</div>';
            return;
        }
    
        // Log the first spell to see its structure
        console.log('First spell data:', spells.results[0]);
    
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search spells..." 
                       oninput="spellsPage.handleSearch(event)">
            </div>
            <h2>Spells (${spells.count})</h2>
            <div class="row" id="spellsList">
                ${spells.results.map(spell => {
                    console.log('Processing spell:', spell.name, 'with school:', spell.school);
                    const schoolName = spell.school ? spell.school.name : 'Unknown';
                    return `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${spell.name}</h5>
                                    <p class="card-text">Level: ${spell.level}</p>
                                    <p class="card-text">School: ${schoolName}</p>
                                    <button class="btn btn-primary" 
                                            onclick="window.router.navigate('/spells/${spell.index}')">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    async loadSpellDetails(params) {
        console.log('loadSpellDetails called with params:', params);
        try {
            const spell = await this.api.fetchById('spells', params.id);
            console.log('Spell details loaded:', spell);
            this.renderSpellDetails(spell);
        } catch (error) {
            console.error('Error loading spell details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading spell details</div>';
        }
    }

    renderSpellDetails(spell) {
        console.log('renderSpellDetails called');
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${spell.name}</h2>
                    <p class="card-text"><strong>Level:</strong> ${spell.level}</p>
                    <p class="card-text"><strong>School:</strong> ${spell.school.name}</p>
                    <p class="card-text"><strong>Casting Time:</strong> ${spell.casting_time}</p>
                    <p class="card-text"><strong>Range:</strong> ${spell.range}</p>
                    <p class="card-text"><strong>Components:</strong> ${spell.components.join(', ')}</p>
                    <p class="card-text"><strong>Duration:</strong> ${spell.duration}</p>
                    <h4>Description</h4>
                    <p>${spell.desc.join('<br>')}</p>
                    <button class="btn btn-secondary" onclick="window.router.navigate('/spells')">Back to Spells</button>
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