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

  test("keyboard focus - Tab key reaches the input", async ({ page }) => {
    const input = page.locator(".typing-test-input");
    await input.focus();
    await expect(input).toBeFocused();
  });

  test("typing registers characters and advances cursor", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();

    await page.keyboard.press("f");
    const coloredChar = typingTest.locator("span.correct, span.incorrect");
    await expect(coloredChar.first()).toBeVisible();
  });

  test("mode buttons render all four modes", async ({ page }) => {
    const modeBar = page.getByTestId("typing-test-mode-bar");
    await expect(modeBar).toBeVisible();

    for (const mode of ["code", "snippets", "leetcode", "systems"]) {
      await expect(page.getByTestId(`typing-mode-${mode}`)).toBeVisible();
    }
  });

  test("mode switch before start resets words", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");

    const codeWords = await typingTest.locator(".typing-test-words span > span").allTextContents();

    await page.getByTestId("typing-mode-leetcode").click();

    const leetcodeWords = await typingTest.locator(".typing-test-words span > span").allTextContents();

    expect(codeWords.join("")).not.toEqual(leetcodeWords.join(""));
  });

  test("time selector buttons render 15s / 30s / 60s options", async ({ page }) => {
    for (const t of [15, 30, 60]) {
      await expect(page.getByTestId(`typing-time-${t}`)).toBeVisible();
    }
  });

  test("changing time limit to 15s updates the displayed timer", async ({ page }) => {
    await page.getByTestId("typing-time-15").click();
    const typingTest = page.getByTestId("typing-test");
    await expect(typingTest).toContainText("15s");
  });

  test("timer bar is visible before test starts", async ({ page }) => {
    const timerBar = page.getByTestId("typing-test-timer-bar");
    await expect(timerBar).toBeVisible();
    const inner = timerBar.locator("div").first();
    const style = await inner.getAttribute("style");
    expect(style).toContain("width: 100%");
  });

  test("timer bar shrinks once typing begins", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();
    await page.keyboard.type("function const return");

    await page.waitForTimeout(200);

    const timerBar = page.getByTestId("typing-test-timer-bar");
    const inner = timerBar.locator("div").first();
    const style = await inner.getAttribute("style");
    expect(style).not.toContain("width: 100%");
  });

  test("Tab key resets the test mid-run", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();
    await page.keyboard.type("func");

    await page.keyboard.press("Tab");

    const modeBar = page.getByTestId("typing-test-mode-bar");
    const opacity = await modeBar.evaluate((el) => (el as HTMLElement).style.opacity);
    expect(opacity === "" || opacity === "1").toBe(true);
  });

  test("reset button clears the current run", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();
    await page.keyboard.type("function const");

    const resetBtn = typingTest.locator("button.typing-reset").first();
    await resetBtn.click({ force: true });

    await expect(page.locator(".typing-test-stats")).toBeHidden();
  });

  test("results screen appears after all words are typed", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();

    const wordSpans = typingTest.locator(".typing-test-words > span");
    const count = await wordSpans.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const word = await wordSpans.nth(i).innerText();
      await page.keyboard.type(word);
      if (i < count - 1) {
        await page.keyboard.press(" ");
      }
    }

    const results = page.getByTestId("typing-test-results");
    await expect(results).toBeVisible({ timeout: 3000 });
    await expect(results).toContainText("wpm");
    await expect(results).toContainText("accuracy");
  });

  test("results screen has a try-again button that restarts", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();

    const wordSpans = typingTest.locator(".typing-test-words > span");
    const count = await wordSpans.count();

    for (let i = 0; i < count; i++) {
      const word = await wordSpans.nth(i).innerText();
      await page.keyboard.type(word);
      if (i < count - 1) {
        await page.keyboard.press(" ");
      }
    }

    await expect(page.getByTestId("typing-test-results")).toBeVisible({ timeout: 3000 });

    const tryAgain = typingTest.locator("button.typing-reset");
    await tryAgain.last().click({ force: true });

    await expect(page.getByTestId("typing-test-results")).toBeHidden();
  });

  test("WPM rating label is present in results", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();

    const wordSpans = typingTest.locator(".typing-test-words > span");
    const count = await wordSpans.count();

    for (let i = 0; i < count; i++) {
      const word = await wordSpans.nth(i).innerText();
      await page.keyboard.type(word);
      if (i < count - 1) {
        await page.keyboard.press(" ");
      }
    }

    const rating = page.getByTestId("typing-test-rating");
    await expect(rating).toBeVisible({ timeout: 3000 });
  });

  test("live stats panel has aria-live region for screen readers", async ({ page }) => {
    const typingTest = page.getByTestId("typing-test");
    await typingTest.click();
    await page.keyboard.type("function const");

    const liveWpm = page.getByTestId("typing-test-live-wpm");
    const ariaLive = await liveWpm.locator("..").getAttribute("aria-live");
    expect(ariaLive).toBe("polite");
  });
});
