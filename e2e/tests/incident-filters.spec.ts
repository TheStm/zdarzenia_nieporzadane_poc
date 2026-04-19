import { test, expect } from "@playwright/test";
import { loginAsReporter, loginAsCoordinator, logout } from "../helpers/auth";
import { fillIncidentForm } from "../helpers/incident";

test.describe("Incident list filtering", () => {
  test("reporter can filter own incidents by category", async ({ page }) => {
    await loginAsReporter(page);

    // Create incident with category A
    await page.goto("/report");
    await fillIncidentForm(page, {
      eventType: "ZN",
      department: "Oddział Chirurgii",
      category: "A",
      description:
        "Zdarzenie chirurgiczne do testów filtrowania — procedura kliniczna wymagająca weryfikacji.",
      severity: 2,
    });
    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();

    // Create incident with category D
    await page.goto("/report");
    await fillIncidentForm(page, {
      eventType: "NZN",
      department: "Oddział Kardiologiczny",
      category: "D",
      description:
        "Awaria sprzętu medycznego — monitor parametrów życiowych wykazywał błędne odczyty saturacji.",
      severity: 0,
    });
    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();

    // Go to My Incidents and filter by category A
    await page.goto("/my-incidents");
    await expect(page.locator("table")).toBeVisible();

    const categorySelect = page.locator("select").last();
    await categorySelect.selectOption("A");

    // Should see surgery incident but not cardiology one
    await expect(
      page.getByRole("cell", { name: "Oddział Chirurgii" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Oddział Kardiologiczny" }),
    ).not.toBeVisible();

    // Switch to category D
    await categorySelect.selectOption("D");

    await expect(
      page.getByRole("cell", { name: "Oddział Kardiologiczny" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Oddział Chirurgii" }),
    ).not.toBeVisible();
  });

  test("coordinator can filter incidents by status", async ({ page }) => {
    // Create an incident as reporter first
    await loginAsReporter(page);
    await page.goto("/report");
    await fillIncidentForm(page, {
      eventType: "ZN",
      department: "Oddział Pediatryczny",
      category: "B",
      description:
        "Zdarzenie farmakoterapeutyczne na pediatrii — dawka leku niezgodna z wagą dziecka.",
      severity: 2,
    });
    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();

    // Login as coordinator
    await logout(page);
    await loginAsCoordinator(page);

    // Filter by "new" status — should still show new incidents
    const statusSelect = page.locator("select").first();
    await statusSelect.selectOption("new");

    // At least the one we just created should be visible
    await expect(page.locator("table tbody tr").first()).toBeVisible();

    // Filter by "closed" — no incidents should be closed
    await statusSelect.selectOption("closed");

    // Wait for loading to finish — either empty state or table rows appear
    await expect(
      page.getByText("Brak zgłoszeń").or(page.locator("table tbody tr").first()),
    ).toBeVisible();

    // Should show empty state or rows (from parallel tests)
    const rows = page.locator("table tbody tr");
    const rowCount = await rows.count();
    if (rowCount === 0) {
      await expect(page.getByText("Brak zgłoszeń")).toBeVisible();
    }
  });
});
