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
        this.levelFilters = new Set();
        this.classFilters = new Set();
        console.log('SpellsPage initialized');
    }
    
    handleLevelFilter(event) {
        const level = parseInt(event.target.value);
        if (event.target.checked) {
            this.levelFilters.add(level);
        } else {
            this.levelFilters.delete(level);
        }
        this.filterSpells();
    }
    
    handleClassFilter(event) {
        const className = event.target.value;
        if (event.target.checked) {
            this.classFilters.add(className);
        } else {
            this.classFilters.delete(className);
        }
        this.filterSpells();
    }
    
    filterSpells() {
        const spells = this.allSpells;
        if (!spells) return;
    
        const filteredSpells = spells.results.filter(spell => {
            // Level filter
            if (this.levelFilters.size > 0 && !this.levelFilters.has(spell.level)) {
                return false;
            }
            
            // Class filter
            if (this.classFilters.size > 0 && spell.classes) {
                const spellClasses = new Set(spell.classes.map(cls => cls.name));
                return [...this.classFilters].some(cls => spellClasses.has(cls));
            }
    
            return true;
        });
    
        this.renderSpells({
            count: filteredSpells.length,
            results: filteredSpells
        });
    }
    
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const filteredSpells = this.allSpells.results.filter(spell => 
            spell.name.toLowerCase().includes(searchTerm)
        );
        this.renderSpells({
            count: filteredSpells.length,
            results: filteredSpells
        });
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
            
            this.allSpells = {
                count: spells.count,
                results: detailedSpells
            };
            
            this.renderSpells(this.allSpells);
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
    
        // Get unique classes and levels
        const classes = new Set();
        const levels = new Set();
        spells.results.forEach(spell => {
            if (spell.classes) {
                spell.classes.forEach(cls => classes.add(cls.name));
            }
            levels.add(spell.level);
        });
    
        this.container.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Search spells..." 
                           oninput="spellsPage.handleSearch(event)">
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Level</h6>
                            ${[...levels].sort((a, b) => a - b).map(level => `
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                           id="level${level}" value="${level}" 
                                           onchange="spellsPage.handleLevelFilter(event)">
                                    <label class="form-check-label" for="level${level}">
                                        Level ${level}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                        <div class="col-md-6">
                            <h6>Class</h6>
                            ${[...classes].sort().map(cls => `
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                           id="class${cls.replace(/ /g, '')}" value="${cls}" 
                                           onchange="spellsPage.handleClassFilter(event)">
                                    <label class="form-check-label" for="class${cls.replace(/ /g, '')}">
                                        ${cls}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <h2>Spells (${spells.count})</h2>
            <div class="row" id="spellsList">
                ${spells.results.map(spell => {
                    const schoolName = spell.school ? spell.school.name : 'Unknown';
                    const damageType = spell.damage?.damage_type?.name || 'None';
                    const classesText = spell.classes ? spell.classes.map(cls => cls.name).join(', ') : 'None';
                    return `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${spell.name}</h5>
                                    <p class="card-text"><strong>Level:</strong> ${spell.level}</p>
                                    <p class="card-text"><strong>School:</strong> ${schoolName}</p>
                                    <p class="card-text"><strong>Range:</strong> ${spell.range}</p>
                                    <p class="card-text"><strong>Damage:</strong> ${damageType}</p>
                                    <p class="card-text"><strong>Classes:</strong> ${classesText}</p>
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