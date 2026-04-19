import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { ReportPage } from "./pages/ReportPage";
import { MyIncidentsPage } from "./pages/MyIncidentsPage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { IncidentDetailPage } from "./pages/IncidentDetailPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { ActionsPage } from "./pages/ActionsPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { NotificationBell } from "./components/NotificationBell";
import { Sidebar } from "./components/Sidebar";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "reporter") return <Navigate to="/my-incidents" replace />;
  return <Navigate to="/incidents" replace />;
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-md hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 flex justify-end">
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
              <Route path="/my-incidents" element={<ProtectedRoute allowedRoles={["reporter"]}><MyIncidentsPage /></ProtectedRoute>} />
              <Route path="/incidents" element={<ProtectedRoute allowedRoles={["coordinator", "admin"]}><IncidentsPage /></ProtectedRoute>} />
              <Route path="/incidents/:id" element={<ProtectedRoute><IncidentDetailPage /></ProtectedRoute>} />
              <Route path="/statistics" element={<ProtectedRoute allowedRoles={["coordinator", "admin"]}><StatisticsPage /></ProtectedRoute>} />
              <Route path="/actions" element={<ProtectedRoute allowedRoles={["coordinator", "admin"]}><ActionsPage /></ProtectedRoute>} />
            </Routes>
          </div>
        </main>
      </div>
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
