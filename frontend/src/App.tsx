import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ReportPage } from "./pages/ReportPage";
import { MyIncidentsPage } from "./pages/MyIncidentsPage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { IncidentDetailPage } from "./pages/IncidentDetailPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { ActionsPage } from "./pages/ActionsPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { ROLE_LABELS } from "./types/auth";
import { NotificationBell } from "./components/NotificationBell";

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-blue-700 text-white"
          : "text-blue-100 hover:bg-blue-600 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-blue-200 text-sm">
        {user.full_name} <span className="text-blue-400 text-xs">({ROLE_LABELS[user.role]})</span>
      </span>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="px-3 py-1 rounded-md text-sm text-blue-100 hover:bg-blue-600 transition-colors"
      >
        Wyloguj
      </button>
    </div>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "reporter") return <Navigate to="/my-incidents" replace />;
  return <Navigate to="/incidents" replace />;
}

function Layout() {
  const { user } = useAuth();
  const isStaff = user?.role === "coordinator" || user?.role === "admin";

  return (
    <div className="min-h-screen">
      <nav className="bg-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-white text-xl font-bold">Zdarzenia Niepożądane</span>
              <span className="text-blue-300 text-xs hidden sm:inline">System raportowania</span>
            </div>
            <div className="flex items-center gap-1">
              <NavLink to="/report">Zgłoś zdarzenie</NavLink>
              {user?.role === "reporter" && (
                <NavLink to="/my-incidents">Moje zgłoszenia</NavLink>
              )}
              {isStaff && (
                <>
                  <NavLink to="/incidents">Zgłoszenia</NavLink>
                  <NavLink to="/statistics">Statystyki</NavLink>
                  <NavLink to="/actions">Działania</NavLink>
                </>
              )}
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
          <Route path="/my-incidents" element={<ProtectedRoute allowedRoles={["reporter"]}><MyIncidentsPage /></ProtectedRoute>} />
          <Route path="/incidents" element={<ProtectedRoute allowedRoles={["coordinator", "admin"]}><IncidentsPage /></ProtectedRoute>} />
          <Route path="/incidents/:id" element={<ProtectedRoute><IncidentDetailPage /></ProtectedRoute>} />
          <Route path="/statistics" element={<ProtectedRoute allowedRoles={["coordinator", "admin"]}><StatisticsPage /></ProtectedRoute>} />
          <Route path="/actions" element={<ProtectedRoute allowedRoles={["coordinator", "admin"]}><ActionsPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}
