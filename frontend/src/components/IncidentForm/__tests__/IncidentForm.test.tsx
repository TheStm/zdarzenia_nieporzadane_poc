import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { IncidentForm } from "../IncidentForm";

describe("IncidentForm", () => {
  const onSubmit = vi.fn();

  it("renders step 1 — event type selection", () => {
    render(<IncidentForm onSubmit={onSubmit} />);
    expect(screen.getByRole("group", { name: /typ zdarzenia/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/zdarzenie ze szkodą/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zdarzenie bez szkody/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/near-miss/i)).toBeInTheDocument();
  });

  it("cannot go to next step without selecting event type", async () => {
    render(<IncidentForm onSubmit={onSubmit} />);
    const nextBtn = screen.getByRole("button", { name: /dalej/i });
    await userEvent.click(nextBtn);
    expect(screen.getByRole("group", { name: /typ zdarzenia/i })).toBeInTheDocument();
  });

  it("advances to step 2 after selecting event type and clicking next", async () => {
    render(<IncidentForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByLabelText(/zdarzenie ze szkodą/i));
    await userEvent.click(screen.getByRole("button", { name: /dalej/i }));
    expect(screen.getByRole("group", { name: /kiedy i gdzie/i })).toBeInTheDocument();
  });

  it("can go back from step 2 to step 1", async () => {
    render(<IncidentForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByLabelText(/zdarzenie ze szkodą/i));
    await userEvent.click(screen.getByRole("button", { name: /dalej/i }));
    expect(screen.getByRole("group", { name: /kiedy i gdzie/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /wstecz/i }));
    expect(screen.getByRole("group", { name: /typ zdarzenia/i })).toBeInTheDocument();
  });

  it("shows step indicator with current step number", () => {
    render(<IncidentForm onSubmit={onSubmit} />);
    expect(screen.getByText(/krok 1/i)).toBeInTheDocument();
  });
});
