import { test, expect, type Page } from "@playwright/test";

async function openWorkPage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    window.sessionStorage.setItem("boot-seen", "1");
  });
  await page.goto("/work", { waitUntil: "domcontentloaded" });
  await page.getByTestId("github-commit-pulse").waitFor({
    state: "attached",
    timeout: 10000,
  });
}

test.describe("GitHub commit pulse", () => {
  test("renders telemetry panel with commit data", async ({ page }) => {
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    await expect(pulse).toContainText("~/telemetry");
    await expect(pulse).toContainText("commit pulse");
    await expect(pulse).toContainText("7d commits", { ignoreCase: true });
    await expect(pulse).toContainText("streak", { ignoreCase: true });
    await expect(pulse).toContainText("last push", { ignoreCase: true });
    await expect(pulse).toContainText("github.com/ThyDrSlen");
  });

  test("renders SVG heartbeat visualization", async ({ page }) => {
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    const svg = pulse.locator("svg");
    await expect(svg).toBeAttached();

    const polylines = svg.locator("polyline");
    const count = await polylines.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("github link opens in new tab", async ({ page }) => {
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    const link = pulse.locator('a[href*="github.com"]');
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });
});
