// cypress/e2e/navigation.cy.js
describe('Navigation', () => {
  it('can navigate between pages', () => {
    cy.visit('/');
    cy.get('a[href="#/spells"]').click();
    cy.url().should('include', '#/spells');
    cy.get('h2').should('contain', 'Spells');
  });
});