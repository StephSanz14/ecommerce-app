describe('Register and login', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should create an user 201, and login', () => {
    cy.intercept('POST', '**/api/auth/register').as('registerRequest');
    cy.intercept('POST', '**/api/auth/login').as('logingRequest');

    const timestamp = Date.now();
    const emailTest = `cypress${timestamp}@example.com`;
    const passwordTest = 'Test12345!';

    cy.visit('/register');

    cy.get('#displayName').type(`cypress ${timestamp}`);
    // cy.get('input[id="displayName"]')
    cy.get('#dateOfBirth').type('1990-01-01');
    cy.get('#email').type(emailTest);
    cy.get('#phone').type('1234567890');
    cy.get('#password').type(passwordTest);
    cy.get('#repeatPassword').type(passwordTest);

    // cy.get('input[placeholder="*******"]').eq(0).type(passwordTest);
    // cy.get('input[placeholder="*******"]').eq(1).type(passwordTest);

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(201);
    });

    cy.visit('/login');

    cy.get('input[type="email"]').type(emailTest);
    cy.get('#password').type(passwordTest);

    cy.get('button[type="submit"]').click();

    cy.wait('@logingRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    });

    cy.url({ timeout: 10000 }).should('not.include', '/login');
    cy.window().then(win=>{
        const token = win.localStorage.getItem('token');
        expect(token).to.not.be.null;
    });
  });
});
