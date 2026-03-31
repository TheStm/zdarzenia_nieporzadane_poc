import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { IncidentList } from "../IncidentList";
import type { IncidentListItem } from "../../../types/incident";

const MOCK_ITEMS: IncidentListItem[] = [
  {
    id: 1,
    event_type: "ZN",
    event_date: "2026-03-30T14:30:00",
    department: "Chirurgia",
    category: "B",
    severity: 2,
    status: "new",
    created_at: "2026-03-30T15:00:00",
  },
  {
    id: 2,
    event_type: "NZN",
    event_date: "2026-03-29T10:00:00",
    department: "SOR",
    category: "E",
    severity: 0,
    status: "in_triage",
    created_at: "2026-03-29T11:00:00",
  },
];

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("IncidentList", () => {
  it("renders empty state when no items", () => {
    renderWithRouter(<IncidentList items={[]} total={0} />);
    expect(screen.getByText(/brak zgłoszeń/i)).toBeInTheDocument();
  });

  it("renders list of incidents", () => {
    renderWithRouter(<IncidentList items={MOCK_ITEMS} total={2} />);
    expect(screen.getByText("Chirurgia")).toBeInTheDocument();
    expect(screen.getByText("SOR")).toBeInTheDocument();
  });

  it("shows total count", () => {
    renderWithRouter(<IncidentList items={MOCK_ITEMS} total={2} />);
    expect(screen.getByText("Łącznie: 2")).toBeInTheDocument();
  });

  it("renders severity badges", () => {
    renderWithRouter(<IncidentList items={MOCK_ITEMS} total={2} />);
    expect(screen.getByText("Umiarkowana")).toBeInTheDocument();
    expect(screen.getByText("Brak szkody")).toBeInTheDocument();
  });

  it("renders status labels", () => {
    renderWithRouter(<IncidentList items={MOCK_ITEMS} total={2} />);
    expect(screen.getByText("Nowe")).toBeInTheDocument();
    expect(screen.getByText("W triage")).toBeInTheDocument();
  });

  it("renders links to incident details", () => {
    renderWithRouter(<IncidentList items={MOCK_ITEMS} total={2} />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/incidents/1")).toBe(true);
    expect(links.some((l) => l.getAttribute("href") === "/incidents/2")).toBe(true);
  });
});
