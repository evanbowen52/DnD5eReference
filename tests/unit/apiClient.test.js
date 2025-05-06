// tests/unit/apiClient.test.js
import { DnDAPI } from '../../api/client.js';

describe('DnDAPI', () => {
    let api;

    beforeEach(() => {
        // Mock the global fetch
        global.fetch = jest.fn();
        api = new DnDAPI();
        api.clearCache(); // Clear cache before each test
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetch', () => {
        test('fetches data successfully', async () => {
            const mockData = { results: [] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const data = await api.fetch('/api/spells');
            expect(data).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://www.dnd5eapi.co/api/spells',
                expect.any(Object)
            );
        });

        test('uses cache for subsequent requests', async () => {
            const mockData = { results: [] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            // First call - should fetch from network
            const firstCall = await api.fetch('/api/spells');
            // Second call - should use cache
            const secondCall = await api.fetch('/api/spells');

            expect(firstCall).toEqual(mockData);
            expect(secondCall).toEqual(mockData);
            // Should only call fetch once due to caching
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        test('handles fetch errors', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network error'));
            await expect(api.fetch('/api/spells')).rejects.toThrow('Network error');
        });
    });

    describe('fetchList', () => {
        test('fetches a list of items', async () => {
            const mockList = { results: [{ name: 'Spell 1' }, { name: 'Spell 2' }] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockList,
            });

            const data = await api.fetchList('spells');
            expect(data).toEqual(mockList);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://www.dnd5eapi.co/api/spells',
                expect.any(Object)
            );
        });

        test('throws error for unknown resource type', async () => {
            await expect(api.fetchList('unknown')).rejects.toThrow('Unknown resource type: unknown');
        });
    });

    describe('fetchByIndex', () => {
        test('fetches an item by index', async () => {
            const mockSpell = { name: 'Magic Missile' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockSpell,
            });

            const data = await api.fetchByIndex('spells', 'magic-missile');
            expect(data).toEqual(mockSpell);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://www.dnd5eapi.co/api/spells/magic-missile',
                expect.any(Object)
            );
        });
    });

    describe('clearCache', () => {
        test('clears the cache', async () => {
            const mockData = { results: [] };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => mockData,
            });

            // First call - should fetch from network
            await api.fetch('/api/spells');
            // Clear cache
            api.clearCache();
            // Second call - should fetch from network again
            await api.fetch('/api/spells');

            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });
});