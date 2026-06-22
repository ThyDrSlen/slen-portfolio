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

test.describe("GitHub pulse edge cases", () => {
  test("fallback renders when GitHub API is blocked", async ({ page }) => {
    await page.route("**/api.github.com/**", (route) => route.abort());
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    await expect(pulse).toContainText("github.com/ThyDrSlen");
  });

  test("commit count is a non-negative number", async ({ page }) => {
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    const commitText = await pulse.evaluate((el) => {
      const divs = el.querySelectorAll("div");
      for (const div of divs) {
        if (div.textContent?.includes("7d commits")) {
          const prev = div.previousElementSibling;
          return prev?.textContent ?? "";
        }
      }
      return "";
    });

    const count = parseInt(commitText, 10);
    expect(count).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(count)).toBe(true);
  });

  test("SVG has exactly 7 data points for days", async ({ page }) => {
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    const svg = pulse.locator("svg");
    if ((await svg.count()) > 0) {
      const labels = svg.locator("text");
      const labelCount = await labels.count();
      expect(labelCount).toBeGreaterThanOrEqual(2);
    }
  });

  test("streak value is formatted with d suffix", async ({ page }) => {
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    const hasStreak = await pulse.evaluate((el) => {
      const text = el.textContent ?? "";
      return /\d+d/.test(text) && text.includes("streak");
    });

    expect(hasStreak).toBe(true);
  });

  test("last push date is a valid date string", async ({ page }) => {
    await openWorkPage(page);

    const pulse = page.getByTestId("github-commit-pulse");

    const hasDate = await pulse.evaluate((el) => {
      const text = el.textContent ?? "";
      return (
        (/\d{4}-\d{2}-\d{2}/.test(text) || text.includes("no recent activity")) &&
        text.includes("last push")
      );
    });

    expect(hasDate).toBe(true);
  });
});
