// pages/classes.js
class ClassesPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadClasses() {
        try {
            const classes = await this.api.fetch('classes');
            this.renderClasses(classes);
        } catch (error) {
            console.error('Error loading classes:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading classes</div>';
        }
    }

    renderClasses(classes) {
        this.container.innerHTML = `
            <h2>Classes (${classes.count})</h2>
            <div class="row">
                ${classes.results.map(classData => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${classData.name}</h5>
                                <p class="card-text">Hit Die: d${classData.hit_die}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/classes/${classData.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadClassDetails(classId) {
        try {
            const classData = await this.api.fetchById('classes', classId);
            this.renderClassDetails(classData);
        } catch (error) {
            console.error('Error loading class details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading class details</div>';
        }
    }

    renderClassDetails(classData) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${classData.name}</h2>
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Class Features</h4>
                            ${classData.class_levels.map((level, index) => `
                                <div class="mb-3">
                                    <h5>Level ${index + 1}</h5>
                                    <ul>
                                        ${Object.entries(level).filter(([key]) => key !== 'level').map(([key, value]) => `
                                            <li><strong>${key.replace('_', ' ')}:</strong> ${value}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                        <div class="col-md-6">
                            <h4>Class Information</h4>
                            <ul>
                                <li><strong>Hit Die:</strong> d${classData.hit_die}</li>
                                <li><strong>Proficiencies:</strong>
                                    ${classData.proficiency_choices.length > 0 ? `
                                        <ul>
                                            ${classData.proficiency_choices.map(choice => `
                                                <li>${choice.from.map(option => option.name).join(', ')}</li>
                                            `).join('')}
                                        </ul>
                                    ` : 'None'}
                                </li>
                                <li><strong>Saving Throws:</strong> ${classData.saving_throws.map(st => st.name).join(', ')}</li>
                                <li><strong>Subclasses:</strong>
                                    ${classData.subclasses.length > 0 ? `
                                        <ul>
                                            ${classData.subclasses.map(subclass => `
                                                <li><a href="#/subclasses/${subclass.index}">${subclass.name}</a></li>
                                            `).join('')}
                                        </ul>
                                    ` : 'None'}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mt-3">
                        <h4>Starting Equipment</h4>
                        ${classData.starting_equipment.length > 0 ? `
                            <ul>
                                ${classData.starting_equipment.map(equipment => `
                                    <li>${equipment.equipment.name}</li>
                                `).join('')}
                            </ul>
                        ` : '<p>No starting equipment specified</p>'}
                    </div>
                    <div class="mt-3">
                        <h4>Class Features</h4>
                        ${classData.class_levels.map((level, index) => `
                            <div class="mb-3">
                                <h5>Level ${index + 1}</h5>
                                <ul>
                                    ${Object.entries(level).filter(([key]) => key !== 'level').map(([key, value]) => `
                                        <li><strong>${key.replace('_', ' ')}:</strong> ${value}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the page
const classesPage = new ClassesPage();

// Handle navigation
window.router.addRoute('/classes', () => classesPage.loadClasses());
window.router.addRoute('/classes/:id', (params) => classesPage.loadClassDetails(params.id));