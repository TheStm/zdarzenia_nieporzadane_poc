import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listIncidents, downloadIncidentsExcel } from "../api/incidents";
import { fetchDashboardStats, type DashboardStatsData } from "../api/dashboard";
import { DashboardStats } from "../components/Dashboard/DashboardStats";
import { CategoryChart } from "../components/Dashboard/CategoryChart";
import { MonthlyChart } from "../components/Dashboard/MonthlyChart";
import { OpenRCAPanel } from "../components/Dashboard/OpenRCAPanel";
import { PendingActionsPanel } from "../components/Dashboard/PendingActionsPanel";
import { RiskMatrix } from "../components/Dashboard/RiskMatrix";
import { ActivityFeed } from "../components/Dashboard/ActivityFeed";
import { IncidentList } from "../components/IncidentList/IncidentList";
import type { IncidentListItem, Status, Category } from "../types/incident";
import { STATUS_LABELS, CATEGORY_LABELS } from "../types/incident";

export function DashboardPage() {
  const [items, setItems] = useState<IncidentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "">("");
  const [filterCategory, setFilterCategory] = useState<Category | "">("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      listIncidents({ status: filterStatus || undefined, category: filterCategory || undefined }),
      fetchDashboardStats(),
    ])
      .then(([listData, statsData]) => {
        setItems(listData.items);
        setTotal(listData.total);
        setStats(statsData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Błąd ładowania danych"))
      .finally(() => setLoading(false));
  }, [filterStatus, filterCategory]);

  async function handleExport() {
    setExporting(true);
    try {
      await downloadIncidentsExcel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd eksportu");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {exporting ? "Eksportowanie..." : "Eksport Excel"}
          </button>
          <Link to="/report" className="inline-flex h-10 items-center justify-center rounded-md bg-zdarzenia-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zdarzenia-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            + Zgłoś zdarzenie
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>
      )}

      {/* Stat cards */}
      <DashboardStats items={items} total={total} />

      {/* RCA & Actions row */}
      {stats && (stats.open_rcas.length > 0 || stats.pending_actions.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <OpenRCAPanel rcas={stats.open_rcas} />
          <PendingActionsPanel actions={stats.pending_actions} />
        </div>
      )}

      {/* Charts row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CategoryChart data={stats.by_category} />
          <MonthlyChart data={stats.by_month} />
          <RiskMatrix bySeverity={stats.by_severity} />
        </div>
      )}

      {/* Activity feed */}
      {stats && stats.recent_incidents.length > 0 && (
        <div className="mb-6">
          <ActivityFeed incidents={stats.recent_incidents} />
        </div>
      )}

      {/* Filters + full table */}
      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | "")}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="">Wszystkie statusy</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | "")}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="">Wszystkie kategorie</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{val}. {label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 text-center text-gray-400">Ładowanie...</div>
      ) : (
        <IncidentList items={items} total={total} />
      )}
    </div>
  );
}
