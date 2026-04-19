import type { Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.includes("/login"));
}

export async function loginAsReporter(page: Page) {
  await login(page, "reporter", "reporter");
}

export async function loginAsCoordinator(page: Page) {
  await login(page, "koordynator", "koordynator");
}

export async function loginAsAdmin(page: Page) {
  await login(page, "admin", "admin");
}

export async function logout(page: Page) {
  await page.getByText("Wyloguj").click();
  await page.waitForURL("**/login");
}
