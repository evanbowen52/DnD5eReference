// pages/ability-scores.js

class AbilityScoresPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadAbilityScores() {
        try {
            const scores = await this.api.fetch('ability-scores');
            this.renderAbilityScores(scores);
        } catch (error) {
            console.error('Error loading ability scores:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading ability scores</div>';
        }
    }

    renderAbilityScores(scores) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search ability scores..." 
                       oninput="abilityScoresPage.handleSearch(event)">
            </div>
            <h2>Ability Scores (${scores.count})</h2>
            <div class="row" id="abilityScoresList">
                ${scores.results.map(score => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${score.name}</h5>
                                <p class="card-text">${score.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/ability-scores/${score.index}')">
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
        const abilityScoresList = document.getElementById('abilityScoresList');
        const cards = abilityScoresList.querySelectorAll('.card');
        
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

    async loadAbilityScoreDetails(scoreId) {
        try {
            const score = await this.api.fetchById('ability-scores', scoreId);
            this.renderAbilityScoreDetails(score);
        } catch (error) {
            console.error('Error loading ability score details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading ability score details</div>';
        }
    }

    renderAbilityScoreDetails(score) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${score.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${score.desc}</p>
                    </div>
                    ${score.skills && score.skills.length > 0 ? `
                        <div class="mb-3">
                            <h4>Skills</h4>
                            <ul>
                                ${score.skills.map(skill => `
                                    <li>${skill.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${score.saving_throws && score.saving_throws.length > 0 ? `
                        <div class="mb-3">
                            <h4>Saving Throws</h4>
                            <ul>
                                ${score.saving_throws.map(throwType => `
                                    <li>${throwType.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

window.AbilityScoresPage = AbilityScoresPage;