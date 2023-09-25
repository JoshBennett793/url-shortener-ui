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

  it('Displays the form', () => {
    cy.get('form').within(() => {
      cy.get('input[name=title]').should('exist').and('be.visible')
      cy.get('input[name=urlToShorten]').should('exist').and('be.visible')
      cy.get('button').should('exist').and('be.visible')
    })
  })
})
