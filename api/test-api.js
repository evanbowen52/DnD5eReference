// test-api.js
// Get the API instance from the global scope
const api = window.api;

async function testSpells() {
    try {
        console.log('Testing spell fetching...');
        const spells = await api.fetch('spells');
        console.log('Found spells:', spells.count);
        console.log('First spell:', spells.results[0]);
        
        if (spells.results.length > 0) {
            const firstSpellId = spells.results[0].index;
            console.log('Testing spell details for:', firstSpellId);
            const spellDetails = await api.fetchById('spells', firstSpellId);
            console.log('Spell details:', spellDetails);
        }
    } catch (error) {
        console.error('Error testing spells:', error);
    }
}

async function testMonsters() {
    try {
        console.log('Testing monster fetching...');
        const monsters = await api.fetch('monsters');
        console.log('Found monsters:', monsters.count);
        console.log('First monster:', monsters.results[0]);
        
        if (monsters.results.length > 0) {
            const firstMonsterId = monsters.results[0].index;
            console.log('Testing monster details for:', firstMonsterId);
            const monsterDetails = await api.fetchById('monsters', firstMonsterId);
            console.log('Monster details:', monsterDetails);
        }
    } catch (error) {
        console.error('Error testing monsters:', error);
    }
}

async function runTests() {
    console.log('Starting API tests...');
    
    // Clear cache first
    api.clearCache();
    
    // Run tests
    await testSpells();
    await testMonsters();
    
    console.log('Tests completed!');
}

// Run the tests
runTests();