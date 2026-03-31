import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ReportPage } from "./pages/ReportPage";
import { DashboardPage } from "./pages/DashboardPage";
import { IncidentDetailPage } from "./pages/IncidentDetailPage";

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

function Layout() {
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
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/report">Zgłoś zdarzenie</NavLink>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
