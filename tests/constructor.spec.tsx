import { test, expect } from '@playwright/test';
import { mockBackend, setAuthTokens, clearAuthTokens } from './helpers/mockApi';

const constructorSection = (page: import('@playwright/test').Page) =>
  page.locator('section').filter({ hasText: 'Оформить заказ' });

const addIngredient = async (
  page: import('@playwright/test').Page,
  name: string
) => {
  const card = page.locator('li').filter({ hasText: name });
  await card.getByRole('button', { name: 'Добавить' }).click();
};

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
  });

  test('добавляет булку, начинку и соус в конструктор', async ({ page }) => {
    const builder = constructorSection(page);

    await addIngredient(page, 'Булка');
    await expect(builder.getByText('Булка (верх)')).toBeVisible();
    await expect(builder.getByText('Булка (низ)')).toBeVisible();

    await addIngredient(page, 'Котлета');
    await expect(builder.getByText('Котлета')).toBeVisible();

    await addIngredient(page, 'Соус');
    await expect(builder.getByText('Соус')).toBeVisible();
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await page.goto('/');
    await expect(page.getByText('Булка').first()).toBeVisible();
  });

  test('открывает модалку с данными выбранного ингредиента', async ({
    page
  }) => {
    await page.getByRole('link', { name: 'Булка' }).click();

    const modals = page.locator('#modals');
    await expect(modals).not.toBeEmpty();
    await expect(modals.getByText('Детали ингредиента')).toBeVisible();
    await expect(modals.getByRole('heading', { name: 'Булка' })).toBeVisible();
    await expect(modals.getByText('200')).toBeVisible();
  });

  test('закрывает модалку по клику на крестик', async ({ page }) => {
    await page.getByRole('link', { name: 'Булка' }).click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.locator('#modals button').click();
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await setAuthTokens(page);
    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await clearAuthTokens(page);
  });

  test('создаёт заказ, показывает номер и очищает конструктор', async ({
    page
  }) => {
    const builder = constructorSection(page);

    await addIngredient(page, 'Булка');
    await addIngredient(page, 'Котлета');

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();
    await expect(page.getByText('84721')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByText('Ваш заказ начали готовить')).not.toBeVisible();

    await expect(builder.getByText('Булка (верх)')).not.toBeVisible();
    await expect(builder.getByText('Котлета')).not.toBeVisible();
    await expect(builder.getByText('Выберите булки').first()).toBeVisible();
    await expect(builder.getByText('Выберите начинку')).toBeVisible();
  });
});
