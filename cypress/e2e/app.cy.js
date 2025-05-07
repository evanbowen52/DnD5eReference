// cypress/e2e/app.cy.js
describe('D&D 5e Reference App', () => {
  // Increase the default command timeout for all tests in this file
  Cypress.config('defaultCommandTimeout', 30000);

  // Handle uncaught exceptions
  Cypress.on('uncaught:exception', (err) => {
    console.error('Uncaught exception:', err);
    // Return false to prevent the test from failing
    return false;
  });

  beforeEach(() => {
    // Log the test start
    cy.log(`Starting test: ${Cypress.currentTest.title}`);
    
    // Visit the base URL defined in cypress.config.js
    // Add retry-ability to the visit command
    cy.visit('/', {
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true,
      timeout: 60000
    });
    
    // Wait for the page to be fully loaded
    cy.window().should('have.property', 'document');
    cy.document().should('exist');
    
    // Wait for the main content to be loaded but don't check visibility
    cy.get('#mainContent', { timeout: 10000 }).should('exist');
  });

  it('successfully loads the application', () => {
    // Check the page title
    cy.title().should('include', 'D&D 5e Reference');
    
    // Check for the presence of the main app container
    cy.get('body').should('exist');
    
    // Check for the presence of the navigation
    cy.get('nav.navbar').should('exist');
    
    // Check for the presence of the main content area
    cy.get('#mainContent').should('exist');
    
    // Log a success message
    cy.log('Application loaded successfully');
  });

  it('has working navigation', () => {
    // Define navigation items to test
    const navItems = [
      { text: 'Spells', url: '#/spells' },
      { text: 'Monsters', url: '#/monsters' },
      { text: 'Equipment', url: '#/equipment' },
      { text: 'Rules', url: '#/rules' }
    ];
    
    navItems.forEach(({ text, url }) => {
      // Find and click the navigation link
      cy.get(`a.nav-link[href="${url}"]`)
        .should('exist')
        .and('be.visible')
        .click();
      
      // Verify the URL changed
      cy.url().should('include', url);
      
      // Give the page time to load the new content
      cy.get('#mainContent', { timeout: 10000 }).should('exist');
    });
  });

  afterEach(() => {
    // Log test completion
    cy.log(`Completed test: ${Cypress.currentTest.title}`);
    
    // Take a screenshot on test failure
    if (Cypress.currentTest.state === 'failed') {
      cy.screenshot('test-failure', { capture: 'runner' });
    }
  });
});
