// pages/magic-schools.js
class MagicSchoolsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadMagicSchools() {
        try {
            const schools = await this.api.fetch('magic-schools');
            this.renderMagicSchools(schools);
        } catch (error) {
            console.error('Error loading magic schools:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading magic schools</div>';
        }
    }

    renderMagicSchools(schools) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search magic schools..." 
                       oninput="magicSchoolsPage.handleSearch(event)">
            </div>
            <h2>Magic Schools (${schools.count})</h2>
            <div class="row" id="magicSchoolsList">
                ${schools.results.map(school => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${school.name}</h5>
                                <p class="card-text">${school.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/magic-schools/${school.index}')">
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
        const magicSchoolsList = document.getElementById('magicSchoolsList');
        const cards = magicSchoolsList.querySelectorAll('.card');
        
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

    async loadMagicSchoolDetails(schoolId) {
        try {
            const school = await this.api.fetchById('magic-schools', schoolId);
            this.renderMagicSchoolDetails(school);
        } catch (error) {
            console.error('Error loading magic school details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading magic school details</div>';
        }
    }

    renderMagicSchoolDetails(school) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${school.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${school.desc}</p>
                    </div>
                    ${school.spells && school.spells.length > 0 ? `
                        <div class="mb-3">
                            <h4>Spells</h4>
                            <ul>
                                ${school.spells.map(spell => `
                                    <li>${spell.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

window.MagicSchoolsPage = MagicSchoolsPage;