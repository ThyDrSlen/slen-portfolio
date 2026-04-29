import { test, expect } from "@playwright/test";

test.describe("GitHub commit pulse", () => {
  test("renders telemetry panel with commit data", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();
    await expect(pulse).toBeVisible();

    await expect(pulse).toContainText("~/telemetry");
    await expect(pulse).toContainText("commit pulse");
    await expect(pulse).toContainText("7d commits", { ignoreCase: true });
    await expect(pulse).toContainText("streak", { ignoreCase: true });
    await expect(pulse).toContainText("last push", { ignoreCase: true });
    await expect(pulse).toContainText("github.com/ThyDrSlen");
  });

  test("renders SVG heartbeat visualization", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();

    const svg = pulse.locator("svg");
    await expect(svg).toBeVisible();

    const polylines = svg.locator("polyline");
    const count = await polylines.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("github link opens in new tab", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();

    const link = pulse.locator('a[href*="github.com"]');
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });
});
