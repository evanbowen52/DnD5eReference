// pages/backgrounds.js
class BackgroundsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadBackgrounds() {
        try {
            const backgrounds = await this.api.fetch('backgrounds');
            this.renderBackgrounds(backgrounds);
        } catch (error) {
            console.error('Error loading backgrounds:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading backgrounds</div>';
        }
    }

    renderBackgrounds(backgrounds) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search backgrounds..." 
                       oninput="backgroundsPage.handleSearch(event)">
            </div>
            <h2>Backgrounds (${backgrounds.count})</h2>
            <div class="row" id="backgroundsList">
                ${backgrounds.results.map(background => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${background.name}</h5>
                                <p class="card-text">${background.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/backgrounds/${background.index}')">
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
        const backgroundsList = document.getElementById('backgroundsList');
        const cards = backgroundsList.querySelectorAll('.card');
        
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

    async loadBackgroundDetails(backgroundId) {
        try {
            const background = await this.api.fetchById('backgrounds', backgroundId);
            this.renderBackgroundDetails(background);
        } catch (error) {
            console.error('Error loading background details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading background details</div>';
        }
    }

    renderBackgroundDetails(background) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${background.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${background.desc}</p>
                    </div>
                    ${background.skill_proficiencies && background.skill_proficiencies.length > 0 ? `
                        <div class="mb-3">
                            <h4>Skill Proficiencies</h4>
                            <ul>
                                ${background.skill_proficiencies.map(skill => `
                                    <li>${skill.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${background.tool_proficiencies && background.tool_proficiencies.length > 0 ? `
                        <div class="mb-3">
                            <h4>Tool Proficiencies</h4>
                            <ul>
                                ${background.tool_proficiencies.map(tool => `
                                    <li>${tool.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${background.languages && background.languages.length > 0 ? `
                        <div class="mb-3">
                            <h4>Languages</h4>
                            <ul>
                                ${background.languages.map(lang => `
                                    <li>${lang.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${background.equipment && background.equipment.length > 0 ? `
                        <div class="mb-3">
                            <h4>Equipment</h4>
                            <ul>
                                ${background.equipment.map(item => `
                                    <li>${item.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${background.feature ? `
                        <div class="mb-3">
                            <h4>Feature</h4>
                            <h5>${background.feature.name}</h5>
                            <p>${background.feature.desc}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

window.BackgroundsPage = BackgroundsPage;