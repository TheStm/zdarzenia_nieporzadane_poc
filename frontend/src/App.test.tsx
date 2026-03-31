import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders navigation with app title", () => {
    render(<App />);
    expect(screen.getByText("Zdarzenia Niepożądane")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Zgłoś zdarzenie" })).toBeInTheDocument();
  });
});
