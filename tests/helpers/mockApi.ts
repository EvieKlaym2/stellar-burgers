import { Page } from '@playwright/test';
import path from 'path';

const harPath = path.join(__dirname, '..', 'hars', 'api.har');

export const mockBackend = async (page: Page) => {
  await page.routeFromHAR(harPath, {
    url: '**/api/**',
    update: false
  });
};

export const setAuthTokens = async (page: Page) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
};

export const clearAuthTokens = async (page: Page) => {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.removeItem('refreshToken');
  });
};
