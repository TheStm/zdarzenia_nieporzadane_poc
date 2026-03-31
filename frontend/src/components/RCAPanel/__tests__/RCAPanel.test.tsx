import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { RCAPanel } from "../RCAPanel";

describe("RCAPanel", () => {
  it("shows create button when no RCA exists", () => {
    render(<RCAPanel incidentId={1} rca={null} onUpdate={vi.fn()} />);
    expect(screen.getByRole("button", { name: /rozpocznij analizę/i })).toBeInTheDocument();
  });

  it("shows RCA form when RCA exists", () => {
    const rca = {
      id: 1, incident_id: 1, status: "draft" as const,
      description: "Test", root_causes: null, contributing_factors: null,
      recommendations: null, team_members: "Dr X",
      created_at: "2026-03-30T10:00:00", updated_at: "2026-03-30T10:00:00", completed_at: null,
    };
    render(<RCAPanel incidentId={1} rca={rca} onUpdate={vi.fn()} />);
    expect(screen.getByText(/szkic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/przyczyny źródłowe/i)).toBeInTheDocument();
  });

  it("shows completed badge when RCA is completed", () => {
    const rca = {
      id: 1, incident_id: 1, status: "completed" as const,
      description: "Done", root_causes: "Cause", contributing_factors: "Factor",
      recommendations: "Rec", team_members: "Dr X",
      created_at: "2026-03-30T10:00:00", updated_at: "2026-03-30T10:00:00",
      completed_at: "2026-03-31T10:00:00",
    };
    render(<RCAPanel incidentId={1} rca={rca} onUpdate={vi.fn()} />);
    expect(screen.getByText(/zakończona/i)).toBeInTheDocument();
  });
});
