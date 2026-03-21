import { test, expect } from "@playwright/test";

test.describe("Terminal navigation and advanced input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });
    const input = page.getByTestId("terminal-input");
    await input.scrollIntoViewIfNeeded();
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.focus();
  });

  test("cd about navigates to /about", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("cd about");

    const [response] = await Promise.all([
      page.waitForURL("**/about", { timeout: 5000 }),
      page.keyboard.press("Enter"),
    ]);

    expect(page.url()).toContain("/about");
  });

  test("cd work navigates to /work", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("cd work");

    await Promise.all([
      page.waitForURL("**/work", { timeout: 5000 }),
      page.keyboard.press("Enter"),
    ]);

    expect(page.url()).toContain("/work");
  });

  test("tab completes command names", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("neo");
    await page.keyboard.press("Tab");

    await expect(input).toHaveValue("neofetch");
  });

  test("tab completes paths for cd command", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("cd ");
    await page.keyboard.press("Tab");

    const value = await input.inputValue();
    expect(value.startsWith("cd ")).toBe(true);
    expect(value.length).toBeGreaterThan(3);
  });

  test("arrow down restores draft after history traversal", async ({
    page,
  }) => {
    const input = page.getByTestId("terminal-input");

    await input.fill("help");
    await page.keyboard.press("Enter");
    await input.fill("ls");
    await page.keyboard.press("Enter");

    await input.fill("my draft");
    await page.keyboard.press("ArrowUp");
    await expect(input).toHaveValue("ls");

    await page.keyboard.press("ArrowDown");
    await expect(input).toHaveValue("my draft");
  });

  test("uptime returns formatted duration", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("uptime");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText(/up \d+ minutes?, \d+ seconds?/);
  });

  test("history shows numbered commands in order", async ({ page }) => {
    const input = page.getByTestId("terminal-input");

    await input.fill("pwd");
    await page.keyboard.press("Enter");
    await input.fill("whoami");
    await page.keyboard.press("Enter");
    await input.fill("history");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("1  pwd");
    await expect(output).toContainText("2  whoami");
    await expect(output).toContainText("3  history");
  });

  test("pwd shows current directory", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("pwd");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("terminal-output")).toContainText("~");
  });

  test("cat on directory returns error", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("cat work");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("terminal-output")).toContainText(
      "Is a directory"
    );
  });

  test("cat on missing file returns error", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("cat nonexistent");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("terminal-output")).toContainText(
      "No such file or directory"
    );
  });

  test("echo prints text back", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("echo hello world");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("terminal-output")).toContainText(
      "hello world"
    );
  });

  test("multiple easter eggs work", async ({ page }) => {
    const input = page.getByTestId("terminal-input");

    await input.fill("vim");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("terminal-output")).toContainText("vim");

    await input.fill("coffee");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("terminal-output")).toContainText("Brewing");

    await input.fill("matrix");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("terminal-output")).toContainText(
      "already in the Matrix"
    );
  });

  test("ls work shows case study entries", async ({ page }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("ls work");
    await page.keyboard.press("Enter");

    const output = page.getByTestId("terminal-output");
    await expect(output).toContainText("form-factor");
    await expect(output).toContainText("orwell-scraper");
    await expect(output).toContainText("palo-alto");
  });

  test("cat work/form-factor shows case study details", async ({
    page,
  }) => {
    const input = page.getByTestId("terminal-input");
    await input.fill("cat work/form-factor");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("terminal-output")).toContainText(
      "Form Factor"
    );
  });
});
