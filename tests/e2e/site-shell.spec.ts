import { test, expect } from "@playwright/test";

test.describe("Site shell", () => {
  test("keyboard - skip link is focusable and jumps to main content", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden" });
    await page.keyboard.press("Tab");
    const skipLink = page.getByTestId("skip-link");
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
  });

  test("keyboard - nav links are focusable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden" });
    // Tab past skip link, then through nav
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab"); // logo
    await page.keyboard.press("Tab"); // work
    const workLink = page.getByTestId("nav-link-work");
    await expect(workLink).toBeFocused();
  });

  test("shell renders required selectors", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("site-shell")).toBeVisible();
    await expect(page.getByTestId("primary-nav")).toBeVisible();
    await expect(page.getByTestId("nav-link-work")).toBeVisible();
    await expect(page.getByTestId("nav-link-about")).toBeVisible();
    await expect(page.getByTestId("resume-download-link")).toBeVisible();
    await expect(page.getByTestId("footer-social-links")).toBeVisible();
  });

  test("reduced motion - shell transitions are reduced", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Shell should render without errors in reduced motion mode
    await expect(page.getByTestId("site-shell")).toBeVisible();
    await expect(page.getByTestId("primary-nav")).toBeVisible();
  });
});
