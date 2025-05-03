// api/types.js
// Type definitions for API responses
export const APIResponse = {
    count: 'number',
    results: [{
        index: 'string',
        name: 'string',
        url: 'string'
    }]
};

export const Spell = {
    name: 'string',
    level: 'number',
    school: {
        name: 'string'
    },
    casting_time: 'string',
    range: 'string',
    components: ['string'],
    duration: 'string',
    classes: [{
        name: 'string'
    }],
    description: ['string'],
    higher_level: ['string'],
    material: 'string',
    ritual: 'boolean',
    concentration: 'boolean'
};

export const Monster = {
    name: 'string',
    size: 'string',
    type: 'string',
    alignment: 'string',
    armor_class: 'number',
    hit_points: 'number',
    hit_dice: 'string',
    speed: {
        walking: 'string',
        flying: 'string',
        swimming: 'string',
        climbing: 'string'
    },
    strength: 'number',
    dexterity: 'number',
    constitution: 'number',
    intelligence: 'number',
    wisdom: 'number',
    charisma: 'number',
    damage_vulnerabilities: ['string'],
    damage_resistances: ['string'],
    damage_immunities: ['string'],
    condition_immunities: ['string'],
    senses: {
        darkvision: 'string',
        blindsight: 'string',
        tremorsense: 'string',
        truesight: 'string'
    },
    languages: 'string',
    challenge_rating: 'number',
    special_abilities: [{
        name: 'string',
        desc: 'string'
    }],
    actions: [{
        name: 'string',
        desc: 'string'
    }],
    legendary_actions: [{
        name: 'string',
        desc: 'string'
    }]
};