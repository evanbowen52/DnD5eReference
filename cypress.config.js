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
      // Task for logging to the terminal
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
  },
  // Global error handling
  experimentalSessionAndOrigin: false,
  // Disable video compression for faster test runs
  videoCompression: false,
  // Disable automatic screenshots on test failure
  // (we're handling this in the test files)
  screenshotOnRunFailure: true,
  // Disable video recording for now
  video: false,
});
