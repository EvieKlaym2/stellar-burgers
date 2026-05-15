Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'mock-access-token');
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookie('accessToken');
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
  });
});
