// jest.config.js
export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  moduleDirectories: ['node_modules', '<rootDir>/__mocks__'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(your-esm-dependencies)/)'
  ]
};