import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from "../Sidebar";

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../context/AuthContext";
const mockUseAuth = vi.mocked(useAuth);

function renderSidebar(options?: { path?: string }) {
  return render(
    <MemoryRouter initialEntries={[options?.path ?? "/report"]}>
      <Sidebar open={true} onToggle={vi.fn()} onClose={vi.fn()} />
    </MemoryRouter>,
  );
}

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders app name and logo", () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: "test@example.com", full_name: "Test User", role: "coordinator", is_active: true, created_at: "" },
      loading: false, login: vi.fn(), logout: mockLogout,
    });
    renderSidebar();
    expect(screen.getByText("Zdarzenia Niepożądane")).toBeInTheDocument();
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  it("renders navigation links for coordinator", () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: "test@example.com", full_name: "Test User", role: "coordinator", is_active: true, created_at: "" },
      loading: false, login: vi.fn(), logout: mockLogout,
    });
    renderSidebar();
    expect(screen.getByRole("link", { name: /Zgłoś zdarzenie/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Zgłoszenia/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Statystyki/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Działania/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Moje zgłoszenia/ })).not.toBeInTheDocument();
  });

  it("renders navigation links for reporter", () => {
    mockUseAuth.mockReturnValue({
      user: { id: 2, email: "reporter@example.com", full_name: "Reporter", role: "reporter", is_active: true, created_at: "" },
      loading: false, login: vi.fn(), logout: mockLogout,
    });
    renderSidebar();
    expect(screen.getByRole("link", { name: /Zgłoś zdarzenie/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Moje zgłoszenia/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Statystyki/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Działania/ })).not.toBeInTheDocument();
  });

  it("displays user info", () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: "test@example.com", full_name: "Jan Kowalski", role: "coordinator", is_active: true, created_at: "" },
      loading: false, login: vi.fn(), logout: mockLogout,
    });
    renderSidebar();
    expect(screen.getByText("Jan Kowalski")).toBeInTheDocument();
    expect(screen.getByText("Koordynator")).toBeInTheDocument();
  });

  it("calls logout and navigates on logout click", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: "test@example.com", full_name: "Test User", role: "coordinator", is_active: true, created_at: "" },
      loading: false, login: vi.fn(), logout: mockLogout,
    });
    renderSidebar();
    await userEvent.click(screen.getByText("Wyloguj"));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("calls onToggle when toggle button is clicked", async () => {
    const onToggle = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: "test@example.com", full_name: "Test User", role: "coordinator", is_active: true, created_at: "" },
      loading: false, login: vi.fn(), logout: mockLogout,
    });
    render(
      <MemoryRouter initialEntries={["/report"]}>
        <Sidebar open={true} onToggle={onToggle} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByLabelText("Toggle sidebar"));
    expect(onToggle).toHaveBeenCalled();
  });

  it("returns null when user is not logged in", () => {
    mockUseAuth.mockReturnValue({
      user: null, loading: false, login: vi.fn(), logout: mockLogout,
    });
    const { container } = render(
      <MemoryRouter>
        <Sidebar open={true} onToggle={vi.fn()} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    expect(container.innerHTML).toBe("");
  });
});
