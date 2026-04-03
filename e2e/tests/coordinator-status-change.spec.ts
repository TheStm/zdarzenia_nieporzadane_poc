import { test, expect } from "@playwright/test";
import {
  loginAsReporter,
  loginAsCoordinator,
  logout,
} from "../helpers/auth";
import { fillIncidentForm } from "../helpers/incident";

test.describe("Coordinator changes incident status", () => {
  test("status change is visible on detail page and reporter gets notification", async ({
    page,
  }) => {
    // Reporter creates an incident
    await loginAsReporter(page);
    await page.goto("/report");

    await fillIncidentForm(page, {
      eventType: "ZN",
      department: "Oddział Neurologiczny",
      category: "H",
      description:
        "Opóźnienie w diagnostyce pacjenta z udarem mózgu na SOR — czas door-to-CT przekroczył 45 minut.",
      severity: 3,
    });

    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();
    const incidentLabel = await page.getByText(/ZN-\d{4}/).textContent();

    // Switch to coordinator
    await logout(page);
    await loginAsCoordinator(page);

    // Find and click the incident in the list
    await expect(
      page.getByRole("cell", { name: "Oddział Neurologiczny" }).first(),
    ).toBeVisible();
    await page.getByRole("link", { name: incidentLabel! }).click();

    // Change status to "W triage"
    const statusSelect = page.locator("select").last();
    await statusSelect.selectOption("in_triage");

    // Verify status badge updated — use span badge, not the option in select
    await expect(
      page.locator("span").filter({ hasText: "W triage" }),
    ).toBeVisible();

    // Switch back to reporter to check notification
    await logout(page);
    await loginAsReporter(page);

    await page.getByRole("button", { name: "Powiadomienia" }).click();
    const dropdown = page.getByTestId("notification-dropdown");
    await expect(dropdown).toBeVisible();

    // Reporter should see notification about status change
    await expect(
      dropdown.getByText(/Nowe → W triage/).first(),
    ).toBeVisible();
  });

  test("coordinator sees all incidents, not just their own", async ({
    page,
  }) => {
    // Reporter creates an incident first
    await loginAsReporter(page);
    await page.goto("/report");

    await fillIncidentForm(page, {
      eventType: "NZN",
      department: "Apteka Szpitalna",
      category: "B",
      description:
        "Farmaceuta zauważył niezgodność w zleceniu lekowym — błędna dawka leku przeciwbólowego w systemie informatycznym.",
      severity: 0,
    });

    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();

    // Coordinator should see it
    await logout(page);
    await loginAsCoordinator(page);

    await expect(
      page.getByRole("cell", { name: "Apteka Szpitalna" }).first(),
    ).toBeVisible();
  });
});
