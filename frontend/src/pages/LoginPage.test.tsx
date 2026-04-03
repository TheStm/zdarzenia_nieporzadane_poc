import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { AuthProvider } from "../context/AuthContext";

const mockLogin = vi.fn();
const mockGetMe = vi.fn();

vi.mock("../api/auth", () => ({
  login: (...args: unknown[]) => mockLogin(...args),
  getMe: () => mockGetMe(),
  logout: vi.fn(),
}));

vi.mock("../api/client", () => ({
  getToken: vi.fn().mockReturnValue(null),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form with email and password fields", () => {
    renderLoginPage();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasło")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zaloguj się" })).toBeInTheDocument();
  });

  it("renders app title", () => {
    renderLoginPage();
    expect(screen.getByText("Zdarzenia Niepożądane")).toBeInTheDocument();
  });

  it("shows validation error when fields are empty", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole("button", { name: "Zaloguj się" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Wypełnij wszystkie pola");
  });

  it("calls login on submit with email and password", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ access_token: "token", token_type: "bearer" });
    mockGetMe.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      full_name: "Test",
      role: "reporter",
    });

    renderLoginPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Hasło"), "password123");
    await user.click(screen.getByRole("button", { name: "Zaloguj się" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows error message on login failure", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Nieprawidłowy email lub hasło"));

    renderLoginPage();

    await user.type(screen.getByLabelText("Email"), "wrong@example.com");
    await user.type(screen.getByLabelText("Hasło"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Zaloguj się" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Nieprawidłowy email lub hasło"
    );
  });

  it("disables button during submission", async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(() => {}));

    renderLoginPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Hasło"), "password123");
    await user.click(screen.getByRole("button", { name: "Zaloguj się" }));

    expect(await screen.findByRole("button", { name: "Logowanie..." })).toBeDisabled();
  });
});
