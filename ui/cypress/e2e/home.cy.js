describe('Check homepage functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Scroll anchor button to tools overview exists', () => {
    cy.contains('Tutvu tööriistadega');
  });

  it('Change language', () => {
    cy.get('.language-icon')
      .should('be.visible')
      .realClick();

    cy.contains('English')
      .should('be.visible')
      .click();

    cy.contains('Check out our tools')
      .should('be.visible');
  });

  it('Navigate to "Text publishing"', () => {
    cy.get('.statistics-box-inner')
      .eq(2)
      .within(() => {
        cy.contains('Loovuta oma tekst')
          .scrollIntoView()
          .should('be.visible')
          .click();
      });

    cy.url().should('include', '/adding');
  });
});
