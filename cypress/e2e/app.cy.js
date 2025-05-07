// cypress/e2e/app.cy.js
describe('D&D 5e Reference App', () => {
  beforeEach(() => {
    // Visit the base URL defined in cypress.config.js
    cy.visit('/');
  });

  it('successfully loads', () => {
    // Verify the page title
    cy.title().should('include', 'D&D 5e Reference');
    
    // Add more assertions based on your app's structure
    // For example, if you have a header with a specific class:
    // cy.get('.app-header').should('be.visible');
  });
});
