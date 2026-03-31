import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardStats } from "../DashboardStats";
import type { IncidentListItem } from "../../../types/incident";

const MOCK_ITEMS: IncidentListItem[] = [
  { id: 1, event_type: "ZN", event_date: "2026-03-30T14:30:00", department: "Chirurgia", category: "B", severity: 2, status: "new", created_at: "2026-03-30T15:00:00" },
  { id: 2, event_type: "NZN", event_date: "2026-03-29T10:00:00", department: "SOR", category: "E", severity: 0, status: "in_triage", created_at: "2026-03-29T11:00:00" },
  { id: 3, event_type: "ZN", event_date: "2026-03-28T08:00:00", department: "Chirurgia", category: "B", severity: 3, status: "closed", created_at: "2026-03-28T09:00:00" },
];

describe("DashboardStats", () => {
  it("renders total count", () => {
    render(<DashboardStats items={MOCK_ITEMS} total={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/łącznie/i)).toBeInTheDocument();
  });

  it("renders count of open (non-closed) incidents", () => {
    render(<DashboardStats items={MOCK_ITEMS} total={3} />);
    expect(screen.getByTestId("open-count")).toHaveTextContent("2");
  });

  it("renders count by severity", () => {
    render(<DashboardStats items={MOCK_ITEMS} total={3} />);
    expect(screen.getByTestId("severity-high-count")).toHaveTextContent("1");
  });

  it("renders empty state", () => {
    render(<DashboardStats items={[]} total={0} />);
    expect(screen.getByText(/łącznie/i)).toBeInTheDocument();
  });
});
