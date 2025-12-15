describe('E2E: login and add a product to wishlist', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('visit /login then status code 200, add to cart then status code 200', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    cy.intercept('POST', '**/api/wishlist/add').as('addToWishlist');
    cy.intercept('GET', '**/api/wishlist*').as('getWishlist');
    

    cy.visit('/login');

    cy.get('input[type="email"]')
      .should('exist')
      .clear()
      .type('cypress1765701087188@example.com');
    cy.get('input[type="password"]').should('exist').clear().type('Test12345!');
    cy.get('button[type="submit"]').should('exist').click();

    cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    });

    const productId = '68f6567d54fdbb36cfac9e20'; 
    cy.visit(`/product-view/${productId}`);

    cy.get('[data-cy="add-to-wishlist-btn"]').click();

    cy.wait('@addToWishlist', { timeout: 10000 }).then((interception) => {
      expect(interception.response).not.to.be.undefined;
      expect ([200, 201, 400]).to.include(interception.response!.statusCode);
    });

    const productId2 = '689991ce3a96ccf4bb033448'; 
    cy.visit(`/product-view/${productId2}`);

    cy.get('[data-cy="add-to-wishlist-btn"]').click();

    cy.wait('@addToWishlist', { timeout: 10000 }).then((interception) => {
      expect(interception.response).not.to.be.undefined;
      expect ([200, 201, 400]).to.include(interception.response!.statusCode);
    });

    cy.visit('/user/wishlist');
    cy.wait('@getWishlist', { timeout: 10000 });

    cy.get('[data-cy="wishlist-item"]').should('have.length.at.least', 1);


    });
});
