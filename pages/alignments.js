// pages/alignments.js
class AlignmentsPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.api = window.api;
        this.searchInput = null;
    }

    async loadAlignments() {
        try {
            const alignments = await this.api.fetch('alignments');
            this.renderAlignments(alignments);
        } catch (error) {
            console.error('Error loading alignments:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading alignments</div>';
        }
    }

    renderAlignments(alignments) {
        this.container.innerHTML = `
            <div class="mb-4">
                <input type="text" class="form-control" placeholder="Search alignments..." 
                       oninput="alignmentsPage.handleSearch(event)">
            </div>
            <h2>Alignments (${alignments.count})</h2>
            <div class="row" id="alignmentsList">
                ${alignments.results.map(alignment => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${alignment.name}</h5>
                                <p class="card-text">${alignment.desc}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/alignments/${alignment.index}')">
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
        const alignmentsList = document.getElementById('alignmentsList');
        const cards = alignmentsList.querySelectorAll('.card');
        
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

    async loadAlignmentDetails(alignmentId) {
        try {
            const alignment = await this.api.fetchById('alignments', alignmentId);
            this.renderAlignmentDetails(alignment);
        } catch (error) {
            console.error('Error loading alignment details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading alignment details</div>';
        }
    }

    renderAlignmentDetails(alignment) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${alignment.name}</h2>
                    <div class="mb-3">
                        <h4>Description</h4>
                        <p>${alignment.desc}</p>
                    </div>
                    ${alignment.classes && alignment.classes.length > 0 ? `
                        <div class="mb-3">
                            <h4>Classes</h4>
                            <ul>
                                ${alignment.classes.map(cls => `
                                    <li>${cls.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${alignment.races && alignment.races.length > 0 ? `
                        <div class="mb-3">
                            <h4>Races</h4>
                            <ul>
                                ${alignment.races.map(race => `
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

// Initialize the page
const alignmentsPage = new AlignmentsPage();

// Handle navigation
window.router.addRoute('/alignments', () => alignmentsPage.loadAlignments());
window.router.addRoute('/alignments/:id', (params) => alignmentsPage.loadAlignmentDetails(params.id));