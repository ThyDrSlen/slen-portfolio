import { test, expect } from "@playwright/test";

test.describe("Cursor trail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });
    await page.waitForTimeout(500);
  });

  test("page content stays visible with active mouse movement", async ({
    page,
  }) => {
    await page.mouse.move(200, 200);
    await page.mouse.move(640, 360);
    await page.mouse.move(900, 500);
    await page.waitForTimeout(500);

    await expect(page.getByTestId("hero-headline")).toBeVisible();
    await expect(page.getByTestId("interactive-terminal")).toBeVisible();
    await expect(page.getByTestId("subway-status-bar")).toBeVisible();
  });

  test("CTA buttons remain clickable under cursor trail", async ({
    page,
  }) => {
    const cta = page.getByTestId("primary-cta");
    const box = await cta.boundingBox();

    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(200);
    }

    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();
    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();
  });

  test("canvas element has pointer-events none", async ({ page }) => {
    const canvas = page.locator('canvas[aria-hidden="true"]');
    const count = await canvas.count();

    for (let i = 0; i < count; i++) {
      const pointerEvents = await canvas.nth(i).evaluate(
        (el) => getComputedStyle(el).pointerEvents
      );
      expect(pointerEvents).toBe("none");
    }
  });

  test("reduced motion disables cursor trail", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const cursorCanvas = page.locator(
      'canvas[aria-hidden="true"][style*="z-index: 10"]'
    );
    await expect(cursorCanvas).toHaveCount(0);
  });

  test("terminal input remains focusable with trail active", async ({
    page,
  }) => {
    const terminal = page.getByTestId("interactive-terminal");
    await terminal.waitFor({ state: "visible", timeout: 5000 });
    await terminal.scrollIntoViewIfNeeded();

    const input = page.getByTestId("terminal-input");
    const box = await input.boundingBox();

    if (box) {
      await page.mouse.move(box.x + 10, box.y + 5);
      await page.waitForTimeout(100);
    }

    await input.focus();
    await input.fill("whoami");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("terminal-output")).toContainText(
      "visitor"
    );
  });
});
