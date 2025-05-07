// tests/integration/spellsPage.test.js
import SpellsPage from '../../pages/spells.js';

// Mock the client module
jest.mock('../../api/client', () => {
    return {
        DnDAPI: jest.fn().mockImplementation(() => ({
            fetchList: jest.fn(),
            fetchByIndex: jest.fn(),
            clearCache: jest.fn()
        }))
    };
});

// Import the mock after setting it up
const { DnDAPI } = require('../../api/client');

describe('SpellsPage Integration', () => {
    let page;
    let container;
    let mockApi;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Set up our document body
        container = document.createElement('div');
        container.id = 'mainContent';
        document.body.appendChild(container);
        
        // Create a mock API instance
        mockApi = new DnDAPI();
        
        // Create a new instance of SpellsPage with our mock API
        page = new SpellsPage(mockApi);
    });

    afterEach(() => {
        // Clean up
        document.body.removeChild(container);
    });

    test('renders loading state', async () => {
        // Mock the API call to resolve after a delay
        mockApi.fetchList.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve({ results: [] }), 100))
        );

        // Start rendering
        const initPromise = page.init();
        
        // Check loading state
        expect(container.querySelector('.loading')).not.toBeNull();
        expect(container.textContent).toContain('Loading spells...');
        
        // Wait for init to complete
        await initPromise;
    });

    test('renders spells list', async () => {
        const mockSpells = {
            results: [
                { 
                    index: 'spell-1', 
                    name: 'Magic Missile', 
                    level: 1, 
                    school: { name: 'Evocation' }, 
                    components: ['V', 'S'] 
                },
                { 
                    index: 'spell-2', 
                    name: 'Fireball', 
                    level: 3, 
                    school: { name: 'Evocation' }, 
                    components: ['V', 'S', 'M'] 
                }
            ]
        };

        // Mock the API call
        mockApi.fetchList.mockResolvedValue(mockSpells);

        // Initialize the page
        await page.init();

        // Check that spells are rendered
        const spellCards = container.querySelectorAll('.spell-card');
        expect(spellCards.length).toBe(2);
        expect(container.textContent).toContain('Magic Missile');
        expect(container.textContent).toContain('Fireball');
        expect(container.textContent).toContain('Level 1');
        expect(container.textContent).toContain('Level 3');
    });

    test('shows spell details', async () => {
        const mockSpell = {
            index: 'magic-missile',
            name: 'Magic Missile',
            level: 1,
            school: { name: 'Evocation' },
            components: ['V', 'S'],
            desc: ['You create three glowing darts of magical force.'],
            casting_time: '1 action',
            range: '120 feet',
            duration: 'Instantaneous',
            concentration: false,
            ritual: false
        };

        // Mock the API calls
        mockApi.fetchList.mockResolvedValue({ results: [] });
        mockApi.fetchByIndex.mockResolvedValue(mockSpell);

        // Initialize the page
        await page.init();
        
        // Show spell details
        await page.showSpellDetails('magic-missile');

        // Check that spell details are rendered
        expect(container.querySelector('.spell-details')).not.toBeNull();
        expect(container.textContent).toContain('Magic Missile');
        expect(container.textContent).toContain('Level 1');
        expect(container.textContent).toContain('Evocation');
        expect(container.textContent).toContain('You create three glowing darts of magical force.');
    });

    test('filters spells by search term', async () => {
        const mockSpells = {
            results: [
                { index: 'spell-1', name: 'Magic Missile', level: 1, school: { name: 'Evocation' }, components: ['V', 'S'] },
                { index: 'spell-2', name: 'Fireball', level: 3, school: { name: 'Evocation' }, components: ['V', 'S', 'M'] },
                { index: 'spell-3', name: 'Mage Armor', level: 1, school: { name: 'Abjuration' }, components: ['V', 'S', 'M'] }
            ]
        };

        // Mock the API call
        mockApi.fetchList.mockResolvedValue(mockSpells);

        // Initialize the page
        await page.init();

        // Filter spells
        page.filterSpells('magic');
        
        // Check that only matching spells are shown
        const spellCards = container.querySelectorAll('.spell-card');
        expect(spellCards.length).toBe(1);
        expect(container.textContent).toContain('Magic Missile');
        expect(container.textContent).not.toContain('Fireball');
        expect(container.textContent).not.toContain('Mage Armor');
    });

    test('handles errors when loading spells', async () => {
        // Mock a failed API call
        mockApi.fetchList.mockRejectedValue(new Error('Network error'));

        // Initialize the page
        await page.init();

        // Check that error state is rendered
        expect(container.querySelector('.alert-danger')).not.toBeNull();
        expect(container.textContent).toContain('Failed to load spells');
    });
});