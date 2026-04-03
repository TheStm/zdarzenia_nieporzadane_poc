import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listIncidents } from "../api/incidents";
import { IncidentList } from "../components/IncidentList/IncidentList";
import type { IncidentListItem, Status, Category } from "../types/incident";
import { STATUS_LABELS, CATEGORY_LABELS } from "../types/incident";

export function MyIncidentsPage() {
  const [items, setItems] = useState<IncidentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "">("");
  const [filterCategory, setFilterCategory] = useState<Category | "">("");

  useEffect(() => {
    setLoading(true);
    listIncidents({
      status: filterStatus || undefined,
      category: filterCategory || undefined,
    })
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Błąd ładowania"))
      .finally(() => setLoading(false));
  }, [filterStatus, filterCategory]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Moje zgłoszenia</h1>
        <Link
          to="/report"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Zgłoś zdarzenie
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Status | "")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Wszystkie statusy</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as Category | "")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Wszystkie kategorie</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {val}. {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
          Ładowanie...
        </div>
      ) : (
        <IncidentList items={items} total={total} />
      )}
    </div>
  );
}
