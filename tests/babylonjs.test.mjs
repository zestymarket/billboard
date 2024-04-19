import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/babylonjs/');
});

test.describe('Initial load', () => {
  test('The correct test page is currently loaded', async ({ page }) => {
    await expect(page).toHaveTitle('Babylon.js Test');
  });

  test('All 9 banners are currently loaded', async ({ page }) => {
    const meshesLength = await page.evaluate(() => window.scene.meshes.length);
    expect(meshesLength).toBe(13); // 4 XR setup-related meshes, 9 banners
  });
});

test.describe('Standard styles', () => {
  test('The tall standard banner is present', async ({ page }) => {
    await page.waitForFunction(() => window.scene.meshes[4].material != null);
    const banner1 = await page.evaluate(
      () => window.scene.meshes[4].material.diffuseTexture.name
    );
    expect(banner1.split('/').pop()).toBe('zesty-default-mobile-phone-interstitial.png');
  });

  test('The wide standard banner is present', async ({ page }) => {
    await page.waitForFunction(() => window.scene.meshes[5].material != null);
    const banner2 = await page.evaluate(
      () => window.scene.meshes[5].material.diffuseTexture.name
    );
    expect(banner2.split('/').pop()).toBe('zesty-default-billboard.png');
  });

  test('The square standard banner is present', async ({ page }) => {
    await page.waitForFunction(() => window.scene.meshes[6].material != null);
    const banner3 = await page.evaluate(
      () => window.scene.meshes[6].material.diffuseTexture.name
    );
    expect(banner3.split('/').pop()).toBe('zesty-default-med-rectangle.png');
  });
});

test.describe('Navigation', () => {
  test('Clicking the banner navigates to a new page', async ({ page, context }) => {
    await page.waitForFunction(() => window.scene.meshes[12].actionManager != null);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.evaluate(() => window.scene.meshes[12].actionManager.actions[0].func())
    ])
    await newPage.waitForLoadState();
    const title = await newPage.title();
    expect(title).not.toBe('Babylon.js Test');
  });
});
