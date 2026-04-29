import { test, expect } from "@playwright/test";

test.describe("Interactive terminal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });
  });

  test("renders terminal with welcome message", async ({ page }) => {
    const terminal = page.getByTestId("interactive-terminal");
    await expect(terminal).toBeVisible();

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("Welcome to slen.win");
    await expect(output).toContainText("Last login: today from NYC");
  });

  test("help command lists available commands", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("help");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("ls");
    await expect(output).toContainText("cd");
    await expect(output).toContainText("cat");
    await expect(output).toContainText("whoami");
    await expect(output).toContainText("neofetch");
  });

  test("ls command shows filesystem entries", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("ls");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("about");
    await expect(output).toContainText("work");
    await expect(output).toContainText("resume");
  });

  test("cat command reads content", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("cat about");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("Backend-focused software engineer");
  });

  test("neofetch shows system info", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("neofetch");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("SLEN OS");
    await expect(output).toContainText("Next.js");
    await expect(output).toContainText("TypeScript");
    await expect(output).toContainText("NYC");
  });

  test("unknown command shows error", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("foobar");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("command not found: foobar");
  });

  test("easter egg commands work", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("sudo");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("Permission denied");
  });

  test("arrow up recalls command history", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();

    await input.fill("whoami");
    await page.keyboard.press("Enter");
    await input.fill("pwd");
    await page.keyboard.press("Enter");

    await page.keyboard.press("ArrowUp");
    await expect(input).toHaveValue("pwd");

    await page.keyboard.press("ArrowUp");
    await expect(input).toHaveValue("whoami");
  });

  test("clear command empties output", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("help");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("whoami");

    await input.fill("clear");
    await page.keyboard.press("Enter");
    await expect(output).not.toContainText("whoami");
  });

  test("Ctrl+L clears terminal", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.focus();
    await input.fill("help");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("terminal-output")).toContainText("neofetch");

    await page.keyboard.press("Control+l");
    await expect(page.getByTestId("terminal-output")).not.toContainText("neofetch");
  });
});
