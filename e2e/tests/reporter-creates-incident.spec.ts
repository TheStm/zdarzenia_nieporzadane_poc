import { test, expect } from "@playwright/test";
import { loginAsReporter, loginAsCoordinator, logout } from "../helpers/auth";
import { fillIncidentForm } from "../helpers/incident";

test.describe("Reporter creates incident → coordinator gets notification", () => {
  test("full flow: reporter submits incident, coordinator sees notification", async ({
    page,
  }) => {
    // --- Phase 1: Reporter creates an incident ---
    await loginAsReporter(page);
    await page.goto("/report");

    await fillIncidentForm(page, {
      eventType: "ZN",
      department: "Oddział Chirurgii",
      category: "B",
      description:
        "E2E test: podano niewłaściwy lek pacjentowi z powodu pomyłki w dokumentacji — zdarzenie wymaga analizy.",
      severity: 2,
    });

    // Verify success
    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();
    const incidentNumber = await page.getByText(/ZN-\d{4}/).textContent();
    expect(incidentNumber).toBeTruthy();

    // --- Phase 2: Coordinator checks notifications ---
    await logout(page);
    await loginAsCoordinator(page);

    // Click notification bell — it fetches full list on dropdown open
    await page.getByRole("button", { name: "Powiadomienia" }).click();

    // Verify notification dropdown shows a notification about the new incident
    const dropdown = page.getByTestId("notification-dropdown");
    await expect(dropdown).toBeVisible();

    // Check that there's at least one "Nowe zgłoszenie" notification
    await expect(dropdown.getByText("Nowe zgłoszenie").first()).toBeVisible();

    // Verify that one notification references the specific department
    await expect(
      dropdown.getByText(/Oddział Chirurgii/).first(),
    ).toBeVisible();
  });
});
