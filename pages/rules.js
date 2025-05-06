// pages/rules.js
class RulesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
        this.filterSelect = null;
    }

    async loadRules() {
        try {
            const rules = await this.api.fetch('rules');
            this.renderRules(rules);
        } catch (error) {
            console.error('Error loading rules:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading rules</div>';
        }
    }

    renderRules(rules) {
        this.container.innerHTML = `
            <div class="mb-4">
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" placeholder="Search rules..." 
                               oninput="rulesPage.handleSearch(event)">
                    </div>
                    <div class="col-md-6">
                        <select class="form-select" onchange="rulesPage.handleFilter(event)">
                            <option value="">All Categories</option>
                            ${['Combat', 'Adventuring', 'Spellcasting', 'Resting', 'Death and Dying', 'Experience Points']
                                .map(category => `<option value="${category}">${category}</option>`)
                                .join('')}
                        </select>
                    </div>
                </div>
            </div>
            <h2>Rules (${rules.count})</h2>
            <div class="row" id="rulesList">
                ${rules.results.map(rule => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${rule.name}</h5>
                                <p class="card-text">${rule.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/rules/${rule.index}')">
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
        const rulesList = document.getElementById('rulesList');
        const cards = rulesList.querySelectorAll('.card');
        
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

    handleFilter(event) {
        const filterValue = event.target.value.toLowerCase();
        const rulesList = document.getElementById('rulesList');
        const cards = rulesList.querySelectorAll('.card');
        
        cards.forEach(card => {
            const category = card.querySelector('.card-text').textContent.toLowerCase();
            
            if (filterValue === '' || category.includes(filterValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    async loadRuleDetails(ruleId) {
        try {
            const rule = await this.api.fetchById('rules', ruleId);
            this.renderRuleDetails(rule);
        } catch (error) {
            console.error('Error loading rule details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading rule details</div>';
        }
    }

    renderRuleDetails(rule) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${rule.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${rule.desc}</p>
                    </div>
                    ${rule.references && rule.references.length > 0 ? `
                        <div class="mb-3">
                            <h4>References</h4>
                            <ul>
                                ${rule.references.map(ref => `
                                    <li>
                                        <strong>${ref.name}</strong>
                                        <p>${ref.desc}</p>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

window.RulesPage = RulesPage;