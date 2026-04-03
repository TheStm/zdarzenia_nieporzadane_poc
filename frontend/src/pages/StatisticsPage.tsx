import { useEffect, useState } from "react";
import { fetchDashboardStats, type DashboardStatsData } from "../api/dashboard";
import { listIncidents } from "../api/incidents";
import { DashboardStats } from "../components/Dashboard/DashboardStats";
import { CategoryChart } from "../components/Dashboard/CategoryChart";
import { MonthlyChart } from "../components/Dashboard/MonthlyChart";
import { RiskMatrix } from "../components/Dashboard/RiskMatrix";
import { ActivityFeed } from "../components/Dashboard/ActivityFeed";
import type { IncidentListItem } from "../types/incident";

export function StatisticsPage() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [items, setItems] = useState<IncidentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), listIncidents()])
      .then(([statsData, listData]) => {
        setStats(statsData);
        setItems(listData.items);
        setTotal(listData.total);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Błąd ładowania"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 text-center text-gray-400">
        Ładowanie...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Statystyki</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <DashboardStats items={items} total={total} />

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CategoryChart data={stats.by_category} />
          <MonthlyChart data={stats.by_month} />
          <RiskMatrix bySeverity={stats.by_severity} />
        </div>
      )}

      {stats && stats.recent_incidents.length > 0 && (
        <ActivityFeed incidents={stats.recent_incidents} />
      )}
    </div>
  );
}
