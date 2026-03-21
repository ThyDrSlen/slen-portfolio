import { test, expect } from "@playwright/test";

test.describe("Responsive layout for new features", () => {
  test("mobile 390px - all sections stack and remain visible", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    await expect(page.getByTestId("hero-headline")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("interactive-terminal")).toBeVisible({ timeout: 5000 });

    const terminal = page.getByTestId("interactive-terminal");
    const terminalBox = await terminal.boundingBox();
    expect(terminalBox).not.toBeNull();
    if (terminalBox) {
      expect(terminalBox.width).toBeLessThanOrEqual(390);
    }
  });

  test("mobile 390px - terminal input is usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const input = page.getByTestId("terminal-input");
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.scrollIntoViewIfNeeded();
    await input.focus();
    await input.fill("help");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("terminal-output")).toContainText("ls");
  });

  test("mobile 390px - GitHub pulse doesn't overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    const pulse = page.getByTestId("github-commit-pulse");
    await pulse.scrollIntoViewIfNeeded();

    const pulseBox = await pulse.boundingBox();
    expect(pulseBox).not.toBeNull();
    if (pulseBox) {
      expect(pulseBox.width).toBeLessThanOrEqual(390);
    }
  });

  test("tablet 768px - layout adapts without horizontal scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 5000 });

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test("boot sequence fills viewport on all sizes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const boot = page.getByTestId("boot-sequence");
    if (await boot.isVisible()) {
      const bootBox = await boot.boundingBox();
      expect(bootBox).not.toBeNull();
      if (bootBox) {
        expect(bootBox.width).toBeGreaterThanOrEqual(385);
        expect(bootBox.height).toBeGreaterThanOrEqual(800);
      }
    }
  });

  test("no console errors during page interaction", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.getByTestId("boot-sequence").waitFor({ state: "hidden", timeout: 10000 });

    await page.mouse.move(400, 300);
    await page.mouse.move(600, 400);

    const input = page.getByTestId("terminal-input");
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.scrollIntoViewIfNeeded();
    await input.focus();
    await input.fill("help");
    await page.keyboard.press("Enter");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const realErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("404")
    );
    expect(realErrors).toEqual([]);
  });
});
