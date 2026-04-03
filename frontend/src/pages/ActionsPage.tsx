import { useEffect, useState } from "react";
import { fetchDashboardStats, type DashboardStatsData } from "../api/dashboard";
import { OpenRCAPanel } from "../components/Dashboard/OpenRCAPanel";
import { PendingActionsPanel } from "../components/Dashboard/PendingActionsPanel";

export function ActionsPage() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Błąd ładowania"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
        Ładowanie...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Działania naprawcze</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OpenRCAPanel rcas={stats.open_rcas} />
          <PendingActionsPanel actions={stats.pending_actions} />
        </div>
      )}

      {stats && stats.open_rcas.length === 0 && stats.pending_actions.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
          Brak otwartych analiz RCA i oczekujących działań
        </div>
      )}
    </div>
  );
}
