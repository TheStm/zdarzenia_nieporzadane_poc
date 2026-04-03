import { test, expect } from "@playwright/test";
import { loginAsReporter } from "../helpers/auth";
import { fillIncidentForm } from "../helpers/incident";

test.describe("Reporter views own incidents", () => {
  test("newly created incident appears in Moje zgłoszenia list", async ({
    page,
  }) => {
    await loginAsReporter(page);
    await page.goto("/report");

    await fillIncidentForm(page, {
      eventType: "ZN-0",
      department: "SOR",
      category: "E",
      description:
        "Pacjent poślizgnął się w korytarzu SOR, ale nie odniósł obrażeń dzięki szybkiej reakcji personelu.",
      severity: 1,
    });

    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();

    // Navigate to My Incidents
    await page.goto("/my-incidents");

    // The incident should appear in the list — check for the department in a table cell
    await expect(page.getByRole("cell", { name: "SOR" }).first()).toBeVisible();
  });

  test("reporter can click through to incident detail page", async ({
    page,
  }) => {
    await loginAsReporter(page);
    await page.goto("/report");

    await fillIncidentForm(page, {
      eventType: "ZN",
      department: "Oddział Wewnętrzny",
      category: "B",
      description:
        "Pomyłka w dawkowaniu leku — podano podwójną dawkę paracetamolu pacjentowi na oddziale wewnętrznym.",
      severity: 2,
    });

    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();

    // Click "Zobacz zgłoszenie" to go to detail page
    await page.getByText("Zobacz zgłoszenie").click();

    // Should see incident detail page
    await expect(page.getByText(/ZN-\d{4}/)).toBeVisible();
    await expect(page.getByText("Oddział Wewnętrzny")).toBeVisible();
    await expect(page.getByText(/podwójną dawkę paracetamolu/)).toBeVisible();
  });
});
