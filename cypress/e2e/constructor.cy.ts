import { addIngredientByName, constructorBlock } from '../support/helpers';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер').should('be.visible');
  });

  it('добавляет булку, начинку и соус в конструктор', () => {
    addIngredientByName('Булка');
    constructorBlock().contains('Булка (верх)').should('be.visible');
    constructorBlock().contains('Булка (низ)').should('be.visible');

    addIngredientByName('Котлета');
    constructorBlock().contains('Котлета').should('be.visible');

    addIngredientByName('Соус');
    constructorBlock().contains('Соус').should('be.visible');
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открывает модалку с данными выбранного ингредиента', () => {
    cy.contains('a', 'Булка').click();

    cy.get('#modals').should('not.be.empty');
    cy.get('#modals').within(() => {
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('h3', 'Булка').should('be.visible');
      cy.contains('200').should('be.visible');
    });
  });

  it('закрывает модалку по клику на крестик', () => {
    cy.contains('a', 'Булка').click();
    cy.contains('Детали ингредиента').should('be.visible');

    cy.get('#modals button').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('закрывает модалку по клику на оверлей', () => {
    cy.contains('a', 'Булка').click();
    cy.contains('Детали ингредиента').should('be.visible');

    cy.get('#modals').children().last().click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.setAuthTokens();
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearAuthTokens();
  });

  it('создаёт заказ, показывает номер и очищает конструктор', () => {
    addIngredientByName('Булка');
    addIngredientByName('Котлета');

    constructorBlock().contains('Булка (верх)').should('be.visible');
    constructorBlock().contains('Котлета').should('be.visible');

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.contains('Ваш заказ начали готовить').should('be.visible');
    cy.contains('84721').should('be.visible');

    cy.get('#modals button').click();
    cy.contains('Ваш заказ начали готовить').should('not.exist');

    constructorBlock().contains('Булка (верх)').should('not.exist');
    constructorBlock().contains('Котлета').should('not.exist');
    constructorBlock().contains('Выберите булки').should('be.visible');
    constructorBlock().contains('Выберите начинку').should('be.visible');
  });
});
