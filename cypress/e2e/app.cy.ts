describe('App flows', () => {
  it('renders dashboard and components', () => {
    cy.visit('/')
    cy.contains('Balance:').should('exist')
    cy.contains('Approve').should('exist')
    cy.contains('Transfer').should('exist')
    cy.contains('Mint').should('exist')
  })

  it('shows validation messages and button disabled states', () => {
    cy.visit('/')
    cy.get('input[placeholder="Amount"]').first().type('1')
    cy.get('input[placeholder="Address (for transfer/mint)"]').first().type('0x123')

    cy.contains('Invalid address').should('exist')

    cy.contains('Approve').should('be.disabled')
    cy.contains('Transfer').should('be.disabled')
    cy.contains('Mint').should('be.disabled')

    cy.get('input[placeholder="Address (for transfer/mint)"]')
      .first()
      .clear()
      .type('0x' + '0'.repeat(40))
    cy.contains('Invalid address').should('not.exist')

    cy.contains('Approve').should('not.be.disabled')
    cy.contains('Transfer').should('not.be.disabled')
    cy.contains('Mint').should('not.be.disabled')
  })
})
