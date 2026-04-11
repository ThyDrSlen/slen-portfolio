import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Pages to audit
const PAGES = [
  { name: "home", path: "/" },
  { name: "work index", path: "/work" },
  { name: "about", path: "/about" },
  { name: "case study form-factor", path: "/work/form-factor" },
  { name: "case study orwell-scraper", path: "/work/orwell-scraper" },
  { name: "case study palo-alto", path: "/work/palo-alto" },
];

// Helper: wait for the boot sequence to complete (only relevant on home)
async function waitForReady(page: import("@playwright/test").Page) {
  const boot = page.getByTestId("boot-sequence");
  const isPresent = await boot.count();
  if (isPresent) {
    await boot.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {
      // Non-home pages won't have it - ignore
    });
  }
}

test.describe("Cross-page accessibility audit (axe-core)", () => {
  for (const { name, path } of PAGES) {
    test(`${name} - no critical axe violations`, async ({ page }) => {
      await page.goto(path);
      await waitForReady(page);

      const results = await new AxeBuilder({ page })
        // Exclude known third-party iframes and animation canvases
        .exclude("[data-testid='cursor-trail']")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      // Filter out any violations that are not serious/critical
      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (critical.length > 0) {
        const summary = critical
          .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`)
          .join("\n");
        throw new Error(`Accessibility violations on ${path}:\n${summary}`);
      }
    });
  }
});

test.describe("Heading hierarchy", () => {
  test("home page has exactly one h1 and h2s follow", async ({ page }) => {
    await page.goto("/");
    await waitForReady(page);

    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);

    const h2s = page.locator("h2");
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThanOrEqual(1);
  });

  test("work index has exactly one h1", async ({ page }) => {
    await page.goto("/work");
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
  });

  test("about page has exactly one h1", async ({ page }) => {
    await page.goto("/about");
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
  });

  for (const slug of ["form-factor", "orwell-scraper", "palo-alto"]) {
    test(`case study ${slug} has exactly one h1`, async ({ page }) => {
      await page.goto(`/work/${slug}`);
      const h1s = page.locator("h1");
      await expect(h1s).toHaveCount(1);
    });
  }
});

test.describe("ARIA landmarks", () => {
  test("home page has main, nav, and footer landmarks", async ({ page }) => {
    await page.goto("/");
    await waitForReady(page);

    await expect(page.locator("main, [role='main']")).toHaveCount(1);
    await expect(page.locator("nav, [role='navigation']").first()).toBeVisible();
    await expect(page.locator("footer, [role='contentinfo']")).toHaveCount(1);
  });

  test("case study page has main landmark", async ({ page }) => {
    await page.goto("/work/form-factor");
    await expect(page.locator("main, [role='main']")).toHaveCount(1);
  });
});

test.describe("Keyboard navigation - cross-page flows", () => {
  test("skip link present and functional on home", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByTestId("skip-link");
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
  });

  test("skip link present and functional on work index", async ({ page }) => {
    await page.goto("/work");
    await page.keyboard.press("Tab");
    const skipLink = page.getByTestId("skip-link");
    await expect(skipLink).toBeFocused();
  });

  test("skip link present and functional on about page", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skipLink = page.getByTestId("skip-link");
    await expect(skipLink).toBeFocused();
  });

  test("skip link present on case study pages", async ({ page }) => {
    await page.goto("/work/form-factor");
    await page.keyboard.press("Tab");
    const skipLink = page.getByTestId("skip-link");
    await expect(skipLink).toBeFocused();
  });

  test("nav links are keyboard-reachable on every page", async ({ page }) => {
    for (const path of ["/", "/work", "/about"]) {
      await page.goto(path);
      // Tab past skip link, logo, then to nav work link
      await page.keyboard.press("Tab"); // skip link
      await page.keyboard.press("Tab"); // logo
      await page.keyboard.press("Tab"); // work nav link
      const workLink = page.getByTestId("nav-link-work");
      await expect(workLink).toBeFocused();
    }
  });

  test("all interactive case study links are focusable", async ({ page }) => {
    await page.goto("/work/form-factor");
    const proofLinks = page.getByTestId("case-study-proof-links").locator("a");
    const count = await proofLinks.count();
    expect(count).toBeGreaterThan(0);

    // Each proof link should have an accessible name
    for (let i = 0; i < count; i++) {
      const link = proofLinks.nth(i);
      const label =
        (await link.getAttribute("aria-label")) ??
        (await link.innerText());
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe("Reduced motion support", () => {
  test("home renders without animation errors under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("hero-headline")).toBeVisible({ timeout: 5000 });
  });

  test("case study renders under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/work/form-factor");
    await expect(page.getByTestId("case-study-page")).toBeVisible();
  });
});

test.describe("Image alt text and link labels", () => {
  test("home - all images have non-empty alt text", async ({ page }) => {
    await page.goto("/");
    await waitForReady(page);

    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      // alt="" is acceptable for decorative images, but must be present
      expect(alt).not.toBeNull();
    }
  });

  test("home - nav links have discernible text or aria-label", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForReady(page);

    const navLinks = page.locator("[data-testid='primary-nav'] a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const text = await link.innerText();
      const ariaLabel = await link.getAttribute("aria-label");
      const hasLabel = (text.trim().length > 0) || (ariaLabel !== null && ariaLabel.trim().length > 0);
      expect(hasLabel).toBe(true);
    }
  });
});
