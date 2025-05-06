// pages/conditions.js
class ConditionsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadConditions() {
        try {
            const conditions = await this.api.fetch('conditions');
            this.renderConditions(conditions);
        } catch (error) {
            console.error('Error loading conditions:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading conditions</div>';
        }
    }

    renderConditions(conditions) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search conditions..." 
                       oninput="conditionsPage.handleSearch(event)">
            </div>
            <h2>Conditions (${conditions.count})</h2>
            <div class="row" id="conditionsList">
                ${conditions.results.map(condition => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${condition.name}</h5>
                                <p class="card-text">${condition.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/conditions/${condition.index}')">
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
        const conditionsList = document.getElementById('conditionsList');
        const cards = conditionsList.querySelectorAll('.card');
        
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

    async loadConditionDetails(conditionId) {
        try {
            const condition = await this.api.fetchById('conditions', conditionId);
            this.renderConditionDetails(condition);
        } catch (error) {
            console.error('Error loading condition details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading condition details</div>';
        }
    }

    renderConditionDetails(condition) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${condition.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${condition.desc}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

window.ConditionsPage = ConditionsPage;