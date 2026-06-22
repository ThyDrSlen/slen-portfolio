import { test, expect, type Page } from "@playwright/test";

test.describe("Typing test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });
  });

  async function unlockTypingTest(page: Page) {
    const terminalInput = page.getByTestId("terminal-input");
    await terminalInput.scrollIntoViewIfNeeded();
    await terminalInput.focus();
    await terminalInput.fill("type");
    await page.keyboard.press("Enter");
    await page.getByTestId("typing-test").scrollIntoViewIfNeeded();
  }

  test("stays hidden until the terminal shortcut unlocks it", async ({ page }) => {
    await expect(page.getByTestId("typing-test")).toHaveCount(0);

    await unlockTypingTest(page);

    await expect(page.getByTestId("terminal-output")).toContainText(
      "typing test unlocked"
    );
    await expect(page.getByTestId("typing-test")).toBeVisible();
    await expect(page.getByLabel("Typing test input")).toBeFocused();
  });

  test("shows live WPM while a run is active", async ({ page }) => {
    await unlockTypingTest(page);
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();
    await page.keyboard.type("function");

    await expect(typingTest).toContainText("wpm");
    await expect(typingTest).toContainText("accuracy");
    await expect(typingTest).toContainText("words");
  });
});
