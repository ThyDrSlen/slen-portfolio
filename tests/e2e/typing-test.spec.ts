import { test, expect } from "@playwright/test";

test.describe("Typing test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
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

  test("mode selector buttons switch word lists", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    const snippetsBtn = typingTest.getByRole("button", { name: "snippets" });

    await expect(snippetsBtn).toBeVisible();
    await snippetsBtn.click();

    const activeMode = typingTest.locator("[data-testid='typing-test-mode-snippets']");
    await expect(activeMode).toBeVisible();
  });

  test("time selector buttons are visible and clickable", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    const time60 = typingTest.getByRole("button", { name: "60" });

    await expect(time60).toBeVisible();
    await time60.click();

    const timerDisplay = typingTest.getByTestId("typing-test-timer");
    await expect(timerDisplay).toContainText("60");
  });

  test("Tab key resets an active run", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();
    await page.keyboard.type("func");

    await expect(typingTest).toContainText("wpm");

    await page.keyboard.press("Tab");

    await expect(typingTest).toContainText(/click here and start typing/i);
  });
});
