// pages/classes.js
import { BasePage } from '../api/basePage';
import { stateManager } from '../api/stateManager';

class ClassesPage {
    static instance = null;

    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadClasses() {
        // Check if we already have the data
        if (stateManager.isPageLoaded('classes') && this.cachedData) {
            this.renderClasses(this.cachedData);
            return;
        }
    
        this.setLoading(true);
        this.clearError();
        
        try {
            // Fetch the list of classes
            const classList = await window.api.fetch('classes');
            this.cachedData = classList;
            stateManager.markPageLoaded('classes');
            
            // If you need to fetch additional details for each class
            const classesWithDetails = await Promise.all(
                classList.results.map(async (cls) => {
                    try {
                        const details = await window.api.fetchById('classes', cls.index);
                        return { ...cls, ...details };
                    } catch (e) {
                        console.error(`Failed to load details for ${cls.name}:`, e);
                        return { ...cls, error: 'Failed to load details' };
                    }
                })
            );
            
            this.cachedData = { ...classList, results: classesWithDetails };
            this.renderClasses(this.cachedData);
            
        } catch (error) {
            console.error('Failed to load classes:', error);
            this.setError(error);
            this.container.innerHTML = this.renderError(`Error loading classes: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    renderClasses(classes) {
        // Clear existing content
        this.container.innerHTML = '';
    
        // Create the main container
        const container = document.createElement('div');
        container.className = 'classes-container';
    
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'D&D 5e Classes';
        container.appendChild(title);
    
        // Create table for class list
        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        
        // Table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Class</th>
                <th>Hit Die</th>
                <th>Primary Ability</th>
                <th>Saving Throws</th>
                <th>Proficiencies</th>
            </tr>
        `;
        table.appendChild(thead);
    
        // Table body
        const tbody = document.createElement('tbody');
        
        classes.results.forEach(cls => {
            const row = document.createElement('tr');
            row.className = 'class-row';
            
            // Handle case where class details failed to load
            if (cls.error) {
                row.innerHTML = `
                    <td colspan="5" class="text-danger">
                        Error loading ${cls.name}: ${cls.error}
                    </td>
                `;
                tbody.appendChild(row);
                return;
            }
    
            // Create class name cell with link to class details
            const nameCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = `#/classes/${cls.index}`;
            link.textContent = cls.name;
            nameCell.appendChild(link);
    
            // Create other cells
            const hitDieCell = document.createElement('td');
            hitDieCell.textContent = `d${cls.hit_die}`;
    
            const abilityCell = document.createElement('td');
            abilityCell.textContent = cls.proficiency_choices?.[0]?.desc || 'N/A';
    
            const savesCell = document.createElement('td');
            savesCell.textContent = cls.saving_throws?.map(s => s.name).join(', ') || 'None';
    
            const profsCell = document.createElement('td');
            profsCell.textContent = cls.proficiencies?.map(p => p.name).join(', ') || 'None';
    
            // Add cells to row
            row.appendChild(nameCell);
            row.appendChild(hitDieCell);
            row.appendChild(abilityCell);
            row.appendChild(savesCell);
            row.appendChild(profsCell);
    
            tbody.appendChild(row);
        });
    
        table.appendChild(tbody);
        container.appendChild(table);
        this.container.appendChild(container);
    
        // Add some basic styling
        const style = document.createElement('style');
        style.textContent = `
            .classes-container {
                padding: 20px;
            }
            .class-row {
                cursor: pointer;
            }
            .class-row:hover {
                background-color: #f5f5f5;
            }
        `;
        this.container.appendChild(style);
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

window.ClassesPage = ClassesPage;