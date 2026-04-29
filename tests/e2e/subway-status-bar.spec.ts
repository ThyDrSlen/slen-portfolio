import { test, expect } from "@playwright/test";

test.describe("Subway status bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });
  });

  test("renders with line indicator, status, and NYC time", async ({
    page,
  }) => {
    const bar = page.getByTestId("subway-status-bar");
    await expect(bar).toBeVisible();

    await expect(bar).toContainText("F");
    await expect(bar.locator("span").first()).toBeVisible();

    const timePattern = /\d{2}:\d{2}:\d{2}/;
    await expect(bar).toContainText(timePattern);
  });

  test("shows a status message", async ({ page }) => {
    const bar = page.getByTestId("subway-status-bar");

    const hasStatus = await bar.evaluate((el) => {
      const text = el.textContent ?? "";
      return (
        text.includes("open to new opportunities") ||
        text.includes("building Form Factor") ||
        text.includes("shipping Go services") ||
        text.includes("based in bay area")
      );
    });
    expect(hasStatus).toBe(true);
  });

  test("dismiss button hides the bar", async ({ page }) => {
    const bar = page.getByTestId("subway-status-bar");
    await expect(bar).toBeVisible();

    await page.getByTestId("subway-dismiss").click();
    await expect(bar).toBeHidden();
  });

  test("stays dismissed after page reload", async ({ page }) => {
    await page.getByTestId("subway-dismiss").click();
    await expect(page.getByTestId("subway-status-bar")).toBeHidden();

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });
    await expect(page.getByTestId("subway-status-bar")).toBeHidden();
  });

  test("escape key dismisses the bar", async ({ page }) => {
    await expect(page.getByTestId("subway-status-bar")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("subway-status-bar")).toBeHidden();
  });

  test("visible with reduced motion preferred", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const bar = page.getByTestId("subway-status-bar");
    await expect(bar).toBeVisible();
  });
});
