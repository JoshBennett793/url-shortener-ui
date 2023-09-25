describe('Home Page Initial Load', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', {
      statusCode: 200,
      fixture: 'getRequest.json'
    }).as('getRequest')
    cy.visit('http://localhost:3000')
  })

  it('Displays page title', () => {
    cy.get('header').find('h1').should('include.text', 'URL Shortener')
  })
})
