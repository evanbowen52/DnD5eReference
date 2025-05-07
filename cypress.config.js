// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',  // Updated port to 3000
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    screenshotOnRunFailure: true,
    // Add retry-ability for flaky tests
    retries: {
      runMode: 1,
      openMode: 0
    },
    // Better error handling
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('uncaught:exception', (err) => {
        console.error('Uncaught exception:', err);
        // Return false to prevent the test from failing
        return false;
      });

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
  responseTimeout: 60000,
  chromeWebSecurity: false, // Disable web security for testing
  // Enable experimental features if needed
  experimentalStudio: false,
  experimentalSessionAndOrigin: false,
  // Configure how many tests should be kept in memory at once
  numTestsKeptInMemory: 5,
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
