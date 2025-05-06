// pages/equipment.js
class EquipmentPage {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebarContent');
        this.api = window.api;
    }

    async loadEquipment() {
        try {
            const equipment = await this.api.fetch('equipment');
            this.renderEquipment(equipment);
        } catch (error) {
            console.error('Error loading equipment:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading equipment</div>';
        }
    }

    renderEquipment(equipment) {
        this.container.innerHTML = `
            <h2>Equipment (${equipment.count})</h2>
            <div class="row">
                ${equipment.results.map(item => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text">Cost: ${item.cost.quantity} ${item.cost.unit}</p>
                                <button class="btn btn-primary" onclick="window.router.navigate('/equipment/${item.index}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async loadEquipmentDetails(equipmentId) {
        try {
            const equipment = await this.api.fetchById('equipment', equipmentId);
            this.renderEquipmentDetails(equipment);
        } catch (error) {
            console.error('Error loading equipment details:', error);
            this.container.innerHTML = '<div class="alert alert-danger">Error loading equipment details</div>';
        }
    }

    renderEquipmentDetails(equipment) {
        this.container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${equipment.name}</h2>
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Basic Information</h4>
                            <ul>
                                <li><strong>Cost:</strong> ${equipment.cost.quantity} ${equipment.cost.unit}</li>
                                <li><strong>Weight:</strong> ${equipment.weight || 'N/A'} lbs</li>
                                <li><strong>Type:</strong> ${equipment.equipment_category.name}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            ${equipment.weapon_category ? `
                                <h4>Weapon Properties</h4>
                                <ul>
                                    <li><strong>Damage:</strong> ${equipment.damage.dice_count}d${equipment.damage.dice_value} ${equipment.damage.damage_type.name}</li>
                                    <li><strong>Range:</strong> ${equipment.range.normal} ft (${equipment.range.long} ft)</li>
                                    ${equipment.properties.length > 0 ? `
                                        <li><strong>Properties:</strong> ${equipment.properties.map(prop => prop.name).join(', ')}</li>
                                    ` : ''}
                                </ul>
                            ` : ''}
                            ${equipment.armor_category ? `
                                <h4>Armor Properties</h4>
                                <ul>
                                    <li><strong>Armor Class:</strong> ${equipment.armor_class.base} + ${equipment.armor_class.dex_bonus ? 'Dex bonus' : 'no Dex bonus'}</li>
                                    ${equipment.armor_class.max_bonus ? `
                                        <li><strong>Max Dex Bonus:</strong> +${equipment.armor_class.max_bonus}</li>
                                    ` : ''}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                    <div class="mt-3">
                        <h4>Description</h4>
                        <p>${equipment.desc.join('<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    }
}


window.EquipmentPage = EquipmentPage;