import { test, expect } from "@playwright/test";
import {
  loginAsReporter,
  loginAsCoordinator,
  logout,
} from "../helpers/auth";
import { fillIncidentForm } from "../helpers/incident";

test.describe("RCA analysis workflow", () => {
  test("coordinator creates RCA, fills analysis, reporter gets notification", async ({
    page,
  }) => {
    // Reporter creates a severe incident
    await loginAsReporter(page);
    await page.goto("/report");

    await fillIncidentForm(page, {
      eventType: "ZN",
      department: "Blok Operacyjny",
      category: "A",
      description:
        "Podczas zabiegu chirurgicznego stwierdzono niezgodność strony operowanej — zabieg wstrzymano i skorygowano.",
      severity: 3,
    });

    await expect(page.getByText("Zgłoszenie przyjęte")).toBeVisible();
    const incidentLabel = await page.getByText(/ZN-\d{4}/).textContent();

    // Coordinator escalates to RCA
    await logout(page);
    await loginAsCoordinator(page);

    await page.getByRole("link", { name: incidentLabel! }).click();

    // Change status to escalated_rca
    const statusSelect = page.locator("select").last();
    await statusSelect.selectOption("escalated_rca");

    // Verify status badge updated
    await expect(
      page.locator("span").filter({ hasText: "Eskalowane do RCA" }),
    ).toBeVisible();

    // Go to RCA tab
    await page.getByRole("button", { name: "RCA i Działania" }).click();

    // Start RCA analysis
    await page.getByRole("button", { name: "Rozpocznij analizę RCA" }).click();

    // RCA panel should now show form fields
    await expect(
      page.getByText("Analiza przyczyn źródłowych (RCA)"),
    ).toBeVisible();

    // Fill in RCA fields
    await page
      .getByPlaceholder(/np\. Dr Nowak/)
      .fill("Dr Wiśniewski, Mgr Kowalska");

    await page
      .getByPlaceholder(/Opis kontekstu/)
      .fill("Zabieg chirurgiczny z niezgodnością strony operowanej");

    await page
      .getByPlaceholder(/Zidentyfikowane przyczyny/)
      .fill("Brak weryfikacji listy kontrolnej WHO przed zabiegiem");

    await page
      .getByPlaceholder(/Czynniki: ludzki/)
      .fill("Zmęczenie zespołu, brak procedury weryfikacji");

    await page
      .getByPlaceholder(/Zalecane działania/)
      .fill("Wdrożyć obowiązkową listę kontrolną WHO");

    // Save
    await page.getByRole("button", { name: "Zapisz" }).click();

    // Wait briefly for save to complete
    await page.waitForTimeout(500);

    // Verify data persisted — reload page and check
    await page.reload();
    await page.getByRole("button", { name: "RCA i Działania" }).click();

    await expect(
      page.getByPlaceholder(/np\. Dr Nowak/),
    ).toHaveValue("Dr Wiśniewski, Mgr Kowalska");
    await expect(page.locator("#root_causes")).toHaveValue(
      /Brak weryfikacji listy kontrolnej/,
    );

    // Check reporter gets notification about RCA created
    await logout(page);
    await loginAsReporter(page);

    await page.getByRole("button", { name: "Powiadomienia" }).click();
    const dropdown = page.getByTestId("notification-dropdown");

    await expect(
      dropdown.getByText(/analizę przyczyn źródłowych/).first(),
    ).toBeVisible();
  });
});
