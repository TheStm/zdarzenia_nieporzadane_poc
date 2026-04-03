import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { App } from "./App";
import { AuthProvider } from "./context/AuthContext";

vi.mock("./api/auth", () => ({
  login: vi.fn(),
  getMe: vi.fn().mockResolvedValue({
    id: 1,
    email: "test@example.com",
    full_name: "Test User",
    role: "coordinator",
    is_active: true,
    created_at: "2026-01-01T00:00:00",
  }),
  logout: vi.fn(),
}));

vi.mock("./api/client", () => ({
  getToken: vi.fn().mockReturnValue("fake-token"),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  apiFetch: vi.fn().mockResolvedValue({ items: [], total: 0 }),
}));

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation with app title", async () => {
    renderApp();
    expect(await screen.findByText("Zdarzenia Niepożądane")).toBeInTheDocument();
  });

  it("renders navigation links for coordinator", async () => {
    renderApp();
    expect(await screen.findByRole("link", { name: "Zgłoś zdarzenie" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Zgłoszenia" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Statystyki" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Działania" })).toBeInTheDocument();
  });
});
