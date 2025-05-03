// pages/rule-sections.js
class RuleSectionsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
        this.filterSelect = null;
    }

    async loadRuleSections() {
        try {
            const sections = await this.api.fetch('rule-sections');
            this.renderRuleSections(sections);
        } catch (error) {
            console.error('Error loading rule sections:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading rule sections</div>';
        }
    }

    renderRuleSections(sections) {
        this.container.innerHTML = `
            <div class="mb-4">
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" placeholder="Search rule sections..." 
                               oninput="ruleSectionsPage.handleSearch(event)">
                    </div>
                    <div class="col-md-6">
                        <select class="form-select" onchange="ruleSectionsPage.handleFilter(event)">
                            <option value="">All Categories</option>
                            ${['Combat', 'Adventuring', 'Spellcasting', 'Resting', 'Death and Dying', 'Experience Points']
                                .map(category => `<option value="${category}">${category}</option>`)
                                .join('')}
                        </select>
                    </div>
                </div>
            </div>
            <h2>Rule Sections (${sections.count})</h2>
            <div class="row" id="ruleSectionsList">
                ${sections.results.map(section => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${section.name}</h5>
                                <p class="card-text">${section.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/rule-sections/${section.index}')">
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
        const ruleSectionsList = document.getElementById('ruleSectionsList');
        const cards = ruleSectionsList.querySelectorAll('.card');
        
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
        const ruleSectionsList = document.getElementById('ruleSectionsList');
        const cards = ruleSectionsList.querySelectorAll('.card');
        
        cards.forEach(card => {
            const category = card.querySelector('.card-text').textContent.toLowerCase();
            
            if (filterValue === '' || category.includes(filterValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    async loadRuleSectionDetails(sectionId) {
        try {
            const section = await this.api.fetchById('rule-sections', sectionId);
            this.renderRuleSectionDetails(section);
        } catch (error) {
            console.error('Error loading rule section details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading rule section details</div>';
        }
    }

    renderRuleSectionDetails(section) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${section.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${section.desc}</p>
                    </div>
                    ${section.subsections && section.subsections.length > 0 ? `
                        <div class="mb-3">
                            <h4>Subsections</h4>
                            <ul>
                                ${section.subsections.map(sub => `
                                    <li>
                                        <strong>${sub.name}</strong>
                                        <p>${sub.desc}</p>
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

// Initialize the page
const ruleSectionsPage = new RuleSectionsPage();

// Handle navigation
window.router.addRoute('/rule-sections', () => ruleSectionsPage.loadRuleSections());
window.router.addRoute('/rule-sections/:id', (params) => ruleSectionsPage.loadRuleSectionDetails(params.id));
