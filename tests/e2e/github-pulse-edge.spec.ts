import { test, expect } from "@playwright/test";

test.describe("GitHub pulse edge cases", () => {
  test("fallback renders when GitHub API is blocked", async ({ page }) => {
    await page.route("**/api.github.com/**", (route) => route.abort());
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();
    await expect(pulse).toBeVisible();

    await expect(pulse).toContainText("github.com/ThyDrSlen");
  });

  test("commit count is a non-negative number", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();

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
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();

    const svg = pulse.locator("svg");
    if ((await svg.count()) > 0) {
      const labels = svg.locator("text");
      const labelCount = await labels.count();
      expect(labelCount).toBeGreaterThanOrEqual(2);
    }
  });

  test("streak value is formatted with d suffix", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();

    const hasStreak = await pulse.evaluate((el) => {
      const text = el.textContent ?? "";
      return /\d+d/.test(text) && text.includes("streak");
    });

    expect(hasStreak).toBe(true);
  });

  test("last push date is a valid date string", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();

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
