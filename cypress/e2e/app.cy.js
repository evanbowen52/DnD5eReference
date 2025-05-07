// cypress/e2e/app.cy.js
describe('D&D 5e Reference App', () => {
  // Increase the default command timeout for all tests in this file
  Cypress.config('defaultCommandTimeout', 15000);

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
      timeout: 30000
    });
    
    // Wait for the page to be fully loaded
    cy.window().should('have.property', 'document');
    cy.document().should('exist');
  });

  it('successfully loads the application', () => {
    // Check the page title
    cy.title().should('include', 'D&D 5e Reference');
    
    // Check for the presence of the main app container
    cy.get('body').should('exist').and('be.visible');
    
    // Check for the presence of the navigation
    cy.get('nav').should('exist').and('be.visible');
    
    // Check for the presence of the main content area
    cy.get('main').should('exist').and('be.visible');
    
    // Log a success message
    cy.log('Application loaded successfully');
  });

  it('has working navigation', () => {
    // Define navigation items to test
    const navItems = ['Spells', 'Monsters', 'Equipment', 'Rules'];
    
    navItems.forEach((item) => {
      cy.contains('a', item)
        .should('exist')
        .and('be.visible')
        .click();
      
      // Verify the URL changed
      cy.url().should('include', item.toLowerCase());
      
      // Verify the page content updated
      cy.get('h1').should('contain', item);
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
