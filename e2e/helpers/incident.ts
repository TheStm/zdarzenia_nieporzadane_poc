import type { Page } from "@playwright/test";

export interface IncidentFormData {
  eventType: "ZN" | "ZN-0" | "NZN";
  department: string;
  category: string;
  description: string;
  severity: number;
}

const DEFAULT_DATA: IncidentFormData = {
  eventType: "ZN",
  department: "Oddział Chirurgii",
  category: "B",
  description:
    "Testowe zdarzenie niepożądane — opis musi mieć co najmniej pięćdziesiąt znaków aby przejść walidację formularza.",
  severity: 2,
};

export async function fillIncidentForm(
  page: Page,
  data: Partial<IncidentFormData> = {},
) {
  const d = { ...DEFAULT_DATA, ...data };

  // Step 1: Event type
  await page.locator(`input[name="event_type"][value="${d.eventType}"]`).click();
  await page.getByRole("button", { name: "Dalej" }).click();

  // Step 2: When & where (date is pre-filled)
  await page.locator("select").first().selectOption(d.department);
  await page.getByRole("button", { name: "Dalej" }).click();

  // Step 3: Description
  await page.locator("select").first().selectOption(d.category);
  await page.locator("textarea").fill(d.description);
  await page.getByRole("button", { name: "Dalej" }).click();

  // Step 4: Severity
  await page
    .locator(`input[name="severity"][value="${d.severity}"]`)
    .click();
  await page.getByRole("button", { name: "Dalej" }).click();

  // Step 5: Patient data — skip with defaults
  await page.getByRole("button", { name: "Dalej" }).click();

  // Step 6: Summary — submit
  await page.getByRole("button", { name: "Wyślij zgłoszenie" }).click();
}
