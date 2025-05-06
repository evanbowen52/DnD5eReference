// pages/skills.js
class SkillsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadSkills() {
        try {
            const skills = await this.api.fetch('skills');
            this.renderSkills(skills);
        } catch (error) {
            console.error('Error loading skills:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading skills</div>';
        }
    }

    renderSkills(skills) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search skills..." 
                       oninput="skillsPage.handleSearch(event)">
            </div>
            <h2>Skills (${skills.count})</h2>
            <div class="row" id="skillsList">
                ${skills.results.map(skill => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${skill.name}</h5>
                                <p class="card-text">${skill.desc}</p>
                                <p class="card-text"><strong>Ability Score:</strong> ${skill.ability_score.name}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/skills/${skill.index}')">
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
        const skillsList = document.getElementById('skillsList');
        const cards = skillsList.querySelectorAll('.card');
        
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

    async loadSkillDetails(skillId) {
        try {
            const skill = await this.api.fetchById('skills', skillId);
            this.renderSkillDetails(skill);
        } catch (error) {
            console.error('Error loading skill details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading skill details</div>';
        }
    }

    renderSkillDetails(skill) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${skill.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${skill.desc}</p>
                    </div>
                    <div class="mb-3">
                        <h4>Ability Score</h4>
                        <p>${skill.ability_score.name}</p>
                    </div>
                    ${skill.classes && skill.classes.length > 0 ? `
                        <div class="mb-3">
                            <h4>Classes</h4>
                            <ul>
                                ${skill.classes.map(cls => `
                                    <li>${cls.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${skill.races && skill.races.length > 0 ? `
                        <div class="mb-3">
                            <h4>Races</h4>
                            <ul>
                                ${skill.races.map(race => `
                                    <li>${race.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

window.SkillsPage = SkillsPage;