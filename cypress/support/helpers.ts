export const constructorBlock = () =>
  cy.contains('Оформить заказ').closest('section');

export const addIngredientByName = (name: string) => {
  cy.contains('li', name).find('button').contains('Добавить').click();
};
