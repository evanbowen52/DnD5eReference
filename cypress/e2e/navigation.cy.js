// cypress/e2e/navigation.cy.js
describe('Navigation', () => {
  beforeEach(() => {
    // Visit the base URL
    cy.visit('/');
    // Wait for the main content to load
    cy.get('#mainContent', { timeout: 10000 }).should('exist');
  });

  it('can navigate between pages', () => {
    // Test navigation to the Spells page
    cy.get('a.nav-link[href="#/spells"]').click();
    cy.url().should('include', '#/spells');
    cy.get('#mainContent', { timeout: 10000 }).should('exist');

    // Test navigation to the Monsters page
    cy.get('a.nav-link[href="#/monsters"]').click();
    cy.url().should('include', '#/monsters');
    cy.get('#mainContent', { timeout: 10000 }).should('exist');

    // Test navigation to the Equipment page
    cy.get('a.nav-link[href="#/equipment"]').click();
    cy.url().should('include', '#/equipment');
    cy.get('#mainContent', { timeout: 10000 }).should('exist');

    // Test navigation to the Rules page
    cy.get('a.nav-link[href="#/rules"]').click();
    cy.url().should('include', '#/rules');
    cy.get('#mainContent', { timeout: 10000 }).should('exist');
  });
});