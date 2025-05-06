// tests/unit/stateManager.test.js
import { stateManager } from '../../api/stateManager.js';

describe('State Manager', () => {
  beforeEach(() => {
    // Clear all mocks and reset state before each test
    jest.clearAllMocks();
    stateManager.clear();
    stateManager.clearCache();
  });

  describe('Page Loading', () => {
    test('marks pages as loaded', () => {
      stateManager.markPageLoaded('spells');
      expect(stateManager.isPageLoaded('spells')).toBe(true);
    });

    test('clears loaded pages', () => {
      stateManager.markPageLoaded('spells');
      stateManager.clear();
      expect(stateManager.isPageLoaded('spells')).toBe(false);
    });

    test('handles multiple pages', () => {
      stateManager.markPageLoaded('spells');
      stateManager.markPageLoaded('classes');
      expect(stateManager.isPageLoaded('spells')).toBe(true);
      expect(stateManager.isPageLoaded('classes')).toBe(true);
    });
  });

  describe('Loading State', () => {
    test('sets and gets loading state', () => {
      stateManager.setLoading(true);
      expect(stateManager.isLoading()).toBe(true);
      stateManager.setLoading(false);
      expect(stateManager.isLoading()).toBe(false);
    });
  });

  describe('Current Page', () => {
    test('sets and gets current page', () => {
      stateManager.setCurrentPage('spells');
      expect(stateManager.getCurrentPage()).toBe('spells');
    });
  });

  describe('Cache', () => {
    test('sets and gets cache', () => {
      const testData = { id: 1, name: 'Test' };
      stateManager.setCache('spells', 'test-key', testData);
      expect(stateManager.getCache('spells', 'test-key')).toEqual(testData);
    });

    test('returns null for non-existent cache', () => {
      expect(stateManager.getCache('spells', 'non-existent')).toBeNull();
    });

    test('clears specific cache', () => {
      stateManager.setCache('spells', 'test-key', {});
      stateManager.clearCache('spells');
      expect(stateManager.getCache('spells', 'test-key')).toBeNull();
    });

    test('clears all caches', () => {
      stateManager.setCache('spells', 'test1', {});
      stateManager.setCache('classes', 'test2', {});
      stateManager.clearCache();
      expect(stateManager.getCache('spells', 'test1')).toBeNull();
      expect(stateManager.getCache('classes', 'test2')).toBeNull();
    });
  });
});