// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',  // Updated port to 3000
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    screenshotOnRunFailure: false,
    // Add retry-ability for flaky tests
    retries: {
      runMode: 1,
      openMode: 0
    },
    // Better error handling
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 30000,
  chromeWebSecurity: false, // Disable web security for testing
  // Enable experimental features if needed
  experimentalStudio: false,
  experimentalSessionAndOrigin: true,
  // Configure how many tests should be kept in memory at once
  numTestsKeptInMemory: 10,
  // Configure how many screenshots to keep when tests fail
  trashAssetsBeforeRuns: true,
  // Configure how many videos to keep
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  // Configure environment variables
  env: {
    // Add any environment variables here
  }
});
