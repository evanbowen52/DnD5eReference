// tests/setupTests.js
import '@testing-library/jest-dom';
import { mockApi } from '../__mocks__/api.js';

// Mock the global API object
global.window.api = mockApi;

// Mock any other browser APIs if needed
global.window.matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
});