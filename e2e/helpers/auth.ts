import type { Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.includes("/login"));
}

export async function loginAsReporter(page: Page) {
  await login(page, "reporter@example.com", "reporter123");
}

export async function loginAsCoordinator(page: Page) {
  await login(page, "koordynator@example.com", "koordynator123");
}

export async function loginAsAdmin(page: Page) {
  await login(page, "admin@example.com", "admin123");
}

export async function logout(page: Page) {
  await page.getByText("Wyloguj").click();
  await page.waitForURL("**/login");
}
