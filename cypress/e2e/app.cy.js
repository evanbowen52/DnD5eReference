// cypress/e2e/app.cy.js
describe('D&D 5e Reference App', () => {
  beforeEach(() => {
    // Visit the base URL defined in cypress.config.js
    cy.visit('/');
  });

  it('successfully loads', () => {
    // Verify the page loads without errors
    cy.log('Checking if page loads successfully');
    
    // Basic assertions
    cy.window().should('have.property', 'document');
    cy.document().should('exist');
    
    // Verify the page title
    cy.title().should('include', 'D&D 5e Reference');
    
    // Add a small wait to ensure page is fully loaded
    // This is a fallback, Cypress automatically waits for most things
    cy.wait(500);
    
    // Log a success message
    cy.log('Page loaded successfully');
  });
});
