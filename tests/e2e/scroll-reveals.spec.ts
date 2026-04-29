import { test, expect } from "@playwright/test";

test.describe("Scroll reveal animations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });
  });

  test("reveal wrappers exist on the page", async ({ page }) => {
    const reveals = page.getByTestId("reveal");
    const count = await reveals.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("sections become visible after scrolling into view", async ({
    page,
  }) => {
    const proofRail = page.getByTestId("proof-rail");
    await proofRail.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(proofRail).toBeVisible();

    const terminal = page.getByTestId("interactive-terminal");
    await terminal.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(terminal).toBeVisible();
  });

  test("reduced motion shows content immediately without animation", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const reveals = page.getByTestId("reveal");
    const count = await reveals.count();

    for (let i = 0; i < count; i++) {
      const reveal = reveals.nth(i);
      await expect
        .poll(
          () => reveal.evaluate((el) => getComputedStyle(el).opacity),
          { timeout: 5000 }
        )
        .toBe("1");
    }
  });
});
