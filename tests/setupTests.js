// tests/setupTests.js

// Mock the global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Default mock implementation that will be used when no specific mock is defined
mockFetch.mockImplementation((url) => {
  // This will log any unmocked fetch calls
  console.warn(`Unmocked fetch call to: ${url}`);
  return Promise.reject(new Error(`No mock implementation for: ${url}`));
});

// Helper to create a successful response
const createSuccessResponse = (data) => ({
  ok: true,
  status: 200,
  json: async () => data,
});

// Helper to create an error response
const createErrorResponse = (status = 500, statusText = 'Internal Server Error') => ({
  ok: false,
  status,
  statusText,
  json: async () => ({
    error: statusText,
    status,
  }),
});

// Make these helpers available to all tests
global.mockFetch = {
  success: (data) => mockFetch.mockResolvedValueOnce(createSuccessResponse(data)),
  error: (status, statusText) => mockFetch.mockResolvedValueOnce(createErrorResponse(status, statusText)),
  networkError: () => mockFetch.mockRejectedValueOnce(new Error('Network error')),
};

// Mock for matchMedia which is not available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});