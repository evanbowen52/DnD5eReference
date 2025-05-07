// cypress/support/commands.js
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Example custom command
Cypress.Commands.add('logToConsole', (message, ...args) => {
  // Log to both the Cypress command log and the browser console
  cy.log(message, ...args);
  cy.window().then((win) => {
    win.console.log(message, ...args);
  });
});

// Command to check if an element is visible and log the result
Cypress.Commands.add('isVisible', (selector) => {
  cy.get(selector).should('be.visible');
  cy.logToConsole(`Element with selector '${selector}' is visible`);
});

// Command to click an element and log the action
Cypress.Commands.add('clickElement', (selector) => {
  cy.get(selector).click();
  cy.logToConsole(`Clicked element with selector '${selector}'`);
});

// Command to type into an input field
Cypress.Commands.add('typeInto', (selector, text) => {
  cy.get(selector).type(text);
  cy.logToConsole(`Typed '${text}' into element with selector '${selector}'`);
});

// Add any additional custom commands below this line
