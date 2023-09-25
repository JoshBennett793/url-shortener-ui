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
      cy.get('input[name=title]')
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'Placeholder', 'Title...')
      cy.get('input[name=urlToShorten]')
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'Placeholder', 'URL to Shorten...')
      cy.get('button').should('exist').and('be.visible')
    })
  })

  it('Form is updated when user fills in input', () => {
    cy.get('form').within(() => {
      cy.get('input[name=title]').type('This will update')
      cy.get('input[name=title]').should('have.value', 'This will update')
      cy.get('input[name=urlToShorten]').type('This will update too')
      cy.get('input[name=urlToShorten]').should(
        'have.value',
        'This will update too'
      )
    })
  })

  it('Displays any existing urls', () => {
    cy.get('.urls-section').children().should('have.length', 1)
    cy.get('div.url').find('h3').should('include.text', 'Awesome photo')
    cy.get('div.url')
      .find('a')
      .should('include.text', 'http://localhost:3001/useshorturl/1')
      .and('have.attr', 'href', 'http://localhost:3001/useshorturl/1')
    cy.get('div.url')
      .find('p')
      .should(
        'include.text',
        'https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'
      )
  })
})

describe('Home Page Initial Load', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', {
      statusCode: 200,
      fixture: 'getRequest.json'
    }).as('getRequest')
    cy.intercept('POST', 'http://localhost:3001/api/v1/urls', {
      statusCode: 201,
      body: {
        id: 2,
        long_url:
          'https://images.unsplash.com/photo-1531898418865-480b7090470f',
        short_url: 'http://localhost:3001/useshorturl/2',
        title: 'Awesome article'
      }
    }).as('postRequest')
    cy.visit('http://localhost:3000')
  })

  it('Successfully POST new submission to API', () => {
    cy.get('form').within(() => {
      cy.get('input[name=title]').type('Awesome article')
      cy.get('input[name=urlToShorten]').type(
        'https://images.unsplash.com/photo-1531898418865-480b7090470f'
      )
      cy.get('button').click()
    })

    cy.wait('@postRequest').then(interception => {
      expect(interception.response.statusCode).to.equal(201)
      expect(interception.response.body).to.deep.equal({
        id: 2,
        long_url:
          'https://images.unsplash.com/photo-1531898418865-480b7090470f',
        short_url: 'http://localhost:3001/useshorturl/2',
        title: 'Awesome article'
      })
    })
  })

  it('Displays newly posted shortened URL', () => {
    cy.get('form').within(() => {
      cy.get('input[name=title]').type('Awesome article')
      cy.get('input[name=urlToShorten]').type(
        'https://images.unsplash.com/photo-1531898418865-480b7090470f'
      )
      cy.get('button').click()
    })

    cy.wait('@postRequest').then(() => {
      cy.get('.urls-section').children().should('have.length', 2)
      cy.get('.urls-section').each(($url, index) => {
        cy.wrap($url).within(() => {
          if (index === 0) {
            cy.get('div.url').find('h3').should('include.text', 'Awesome photo')
            cy.get('div.url')
              .find('a')
              .should('include.text', 'http://localhost:3001/useshorturl/1')
              .and('have.attr', 'href', 'http://localhost:3001/useshorturl/1')
            cy.get('div.url')
              .find('p')
              .should(
                'include.text',
                'https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'
              )
          } else if (index === 1) {
            cy.get('div.url')
              .find('h3')
              .should('include.text', 'Awesome article')
            cy.get('div.url')
              .find('a')
              .should('include.text', 'http://localhost:3001/useshorturl/2')
              .and('have.attr', 'href', 'http://localhost:3001/useshorturl/2')
            cy.get('div.url')
              .find('p')
              .should(
                'include.text',
                'https://images.unsplash.com/photo-1531898418865-480b7090470f'
              )
          }
        })
      })
    })
  })
})
