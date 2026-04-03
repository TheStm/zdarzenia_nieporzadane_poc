import { test, expect } from "@playwright/test";
import { loginAsReporter, loginAsCoordinator } from "../helpers/auth";

test.describe("Login and access control", () => {
  test("unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/report");
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByText("Zdarzenia Niepożądane"),
    ).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill("wrong@example.com");
    await page.locator("#password").fill("wrongpassword");
    await page.locator('button[type="submit"]').click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("login with empty fields shows validation error", async ({ page }) => {
    await page.goto("/login");
    await page.locator('button[type="submit"]').click();

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("alert")).toContainText("Wypełnij wszystkie pola");
  });

  test("reporter is redirected away from coordinator pages", async ({
    page,
  }) => {
    await loginAsReporter(page);

    // Try accessing coordinator-only incidents list
    await page.goto("/incidents");
    await expect(page).toHaveURL(/\/my-incidents/);

    // Try accessing statistics
    await page.goto("/statistics");
    await expect(page).toHaveURL(/\/my-incidents/);

    // Try accessing actions
    await page.goto("/actions");
    await expect(page).toHaveURL(/\/my-incidents/);
  });

  test("coordinator is redirected to /incidents on login", async ({
    page,
  }) => {
    await loginAsCoordinator(page);
    await expect(page).toHaveURL(/\/incidents/);
    await expect(page.getByRole("heading", { name: "Zgłoszenia" })).toBeVisible();
  });

  test("reporter is redirected to /my-incidents on login", async ({
    page,
  }) => {
    await loginAsReporter(page);
    await expect(page).toHaveURL(/\/my-incidents/);
    await expect(
      page.getByRole("heading", { name: "Moje zgłoszenia" }),
    ).toBeVisible();
  });

  test("logout redirects to login page", async ({ page }) => {
    await loginAsReporter(page);
    await page.getByText("Wyloguj").click();
    await expect(page).toHaveURL(/\/login/);
  });
});
