import { test, expect } from "@playwright/test";

test.describe("Typing test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });
    await page.getByTestId("typing-test").scrollIntoViewIfNeeded();
  });

  test("shows live WPM while a run is active", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();
    await page.keyboard.type("function");

    await expect(typingTest).toContainText("wpm");
    await expect(typingTest).toContainText("accuracy");
    await expect(typingTest).toContainText("words");
  });
});
