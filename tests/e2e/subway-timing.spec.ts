import { test, expect } from "@playwright/test";

test.describe("Subway status bar timing and layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });
    await page.getByTestId("subway-status-bar").waitFor({ state: "visible", timeout: 5000 });
  });

  test("clock updates after 2 seconds", async ({ page }) => {
    const bar = page.getByTestId("subway-status-bar");
    const getTime = () =>
      bar.evaluate((el) => {
        const spans = el.querySelectorAll("span");
        for (const span of spans) {
          if (span.textContent?.match(/\d{2}:\d{2}:\d{2}/)) {
            return span.textContent;
          }
        }
        return "";
      });

    const time1 = await getTime();
    await page.waitForTimeout(2000);
    const time2 = await getTime();

    expect(time1).toBeTruthy();
    expect(time2).toBeTruthy();
    expect(time2).not.toBe(time1);
  });

  test("status message rotates after cycle interval", async ({ page }) => {
    const bar = page.getByTestId("subway-status-bar");

    const getMessage = () =>
      bar.evaluate((el) => {
        const spans = el.querySelectorAll("span");
        for (const span of spans) {
          const text = span.textContent?.toLowerCase() ?? "";
          if (
            text.includes("opportunities") ||
            text.includes("form factor") ||
            text.includes("go services") ||
            text.includes("nyc")
          ) {
            return text;
          }
        }
        return "";
      });

    const msg1 = await getMessage();
    await page.waitForTimeout(6000);
    const msg2 = await getMessage();

    expect(msg1).toBeTruthy();
    expect(msg2).toBeTruthy();
    expect(msg2).not.toBe(msg1);
  });

  test("bar stays fixed at viewport bottom when scrolled", async ({
    page,
  }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await page.waitForTimeout(500);

    const bar = page.getByTestId("subway-status-bar");
    const barBox = await bar.boundingBox();
    const viewport = page.viewportSize();

    expect(barBox).not.toBeNull();
    if (barBox && viewport) {
      expect(barBox.y + barBox.height).toBeCloseTo(viewport.height, -1);
    }
  });

  test("mobile viewport - bar remains usable at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const bar = page.getByTestId("subway-status-bar");
    await expect(bar).toBeVisible();

    const barBox = await bar.boundingBox();
    expect(barBox).not.toBeNull();
    if (barBox) {
      expect(barBox.width).toBeGreaterThanOrEqual(380);
      expect(barBox.height).toBeGreaterThanOrEqual(30);
    }

    const dismiss = page.getByTestId("subway-dismiss");
    await expect(dismiss).toBeVisible();
  });

  test("dismiss button has accessible label", async ({ page }) => {
    const dismiss = page.getByTestId("subway-dismiss");
    await expect(dismiss).toHaveAttribute("aria-label", /dismiss/i);
  });
});
