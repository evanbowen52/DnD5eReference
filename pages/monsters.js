// pages/monsters.js
class MonstersPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadMonsters() {
        try {
            const monsters = await this.api.fetch('monsters');
            this.renderMonsters(monsters);
        } catch (error) {
            console.error('Error loading monsters:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading monsters</div>';
        }
    }

    renderMonsters(monsters) {
        this.container.innerHTML = `
            <h2>Monsters (${monsters.count})</h2>
            <div class="row">
                ${monsters.results.map(monster => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${monster.name}</h5>
                                <p class="card-text">CR: ${monster.challenge_rating}</p>
                                <p class="card-text">Type: ${monster.type}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/monsters/${monster.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadMonsterDetails(monsterId) {
        try {
            const monster = await this.api.fetchById('monsters', monsterId);
            this.renderMonsterDetails(monster);
        } catch (error) {
            console.error('Error loading monster details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading monster details</div>';
        }
    }

    renderMonsterDetails(monster) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${monster.name}</h2>
                    <p><strong>Size:</strong> ${monster.size}</p>
                    <p><strong>Type:</strong> ${monster.type}</p>
                    <p><strong>Alignment:</strong> ${monster.alignment}</p>
                    <p><strong>Armor Class:</strong> ${monster.armor_class}</p>
                    <p><strong>Hit Points:</strong> ${monster.hit_points}</p>
                    <p><strong>Hit Dice:</strong> ${monster.hit_dice}</p>
                    <p><strong>Speed:</strong> ${Object.entries(monster.speed).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <h4>Abilities</h4>
                            <ul>
                                <li>Strength: ${monster.strength}</li>
                                <li>Dexterity: ${monster.dexterity}</li>
                                <li>Constitution: ${monster.constitution}</li>
                                <li>Intelligence: ${monster.intelligence}</li>
                                <li>Wisdom: ${monster.wisdom}</li>
                                <li>Charisma: ${monster.charisma}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h4>Special Features</h4>
                            ${monster.special_abilities.length > 0 ? `
                                <ul>
                                    ${monster.special_abilities.map(ability => `
                                        <li><strong>${ability.name}:</strong> ${ability.desc}</li>
                                    `).join('')}
                                </ul>
                            ` : '<p>No special abilities</p>'}
                        </div>
                    </div>
                    <div class="mt-3">
                        <h4>Actions</h4>
                        ${monster.actions.length > 0 ? `
                            <ul>
                                ${monster.actions.map(action => `
                                    <li><strong>${action.name}:</strong> ${action.desc}</li>
                                `).join('')}
                            </ul>
                        ` : '<p>No actions</p>'}
                    </div>
                    ${monster.legendary_actions.length > 0 ? `
                        <div class="mt-3">
                            <h4>Legendary Actions</h4>
                            <ul>
                                ${monster.legendary_actions.map(action => `
                                    <li><strong>${action.name}:</strong> ${action.desc}</li>
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
const monstersPage = new MonstersPage();

// Handle navigation
window.router.addRoute('/monsters', () => monstersPage.loadMonsters());
window.router.addRoute('/monsters/:id', (params) => monstersPage.loadMonsterDetails(params.id));