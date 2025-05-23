// cypress/support/e2e.js
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the 'supportFile'
// configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// ***********************************************
// Add global error handling
// ***********************************************
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.error('Uncaught exception:', err);
  return false;
});

// ***********************************************
// Global before hook
// ***********************************************
beforeEach(() => {
  // Log test start
  cy.log(`Starting test: ${Cypress.currentTest.title}`);
});

// ***********************************************
// Global after hook
// ***********************************************
afterEach(() => {
  // Log test completion
  cy.log(`Completed test: ${Cypress.currentTest.title}`);
});
