import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listIncidents } from "../api/incidents";
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <a href="/api/export/incidents.xlsx" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Eksport Excel
          </a>
          <Link to="/report" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Zgłoś zdarzenie
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
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
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <option value="">Wszystkie statusy</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | "")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <option value="">Wszystkie kategorie</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{val}. {label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">Ładowanie...</div>
      ) : (
        <IncidentList items={items} total={total} />
      )}
    </div>
  );
}
