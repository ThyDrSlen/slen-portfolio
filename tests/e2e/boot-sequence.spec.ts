import { test, expect } from "@playwright/test";

test.describe("Boot sequence", () => {
  test("shows overlay on first visit then fades away", async ({ page }) => {
    await page.goto("/");

    const overlay = page.getByTestId("boot-sequence");
    await expect(overlay).toBeVisible();

    await expect(overlay).toContainText("SLEN OS");
    await expect(overlay).toContainText("System ready.");

    await expect(overlay).toBeHidden({ timeout: 5000 });
  });

  test("does not replay on second visit within same session", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });

    await page.reload();
    await expect(page.getByTestId("boot-sequence")).toBeHidden();
    await expect(page.getByTestId("hero-headline")).toBeVisible();
  });

  test("skips animation when reduced motion is preferred", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByTestId("boot-sequence")).toBeHidden();
    await expect(page.getByTestId("hero-headline")).toBeVisible();
  });
});
