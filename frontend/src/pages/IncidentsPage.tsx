import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listIncidents, downloadIncidentsExcel } from "../api/incidents";
import { IncidentList } from "../components/IncidentList/IncidentList";
import type { IncidentListItem, Status, Category } from "../types/incident";
import { STATUS_LABELS, CATEGORY_LABELS } from "../types/incident";

export function IncidentsPage() {
  const [items, setItems] = useState<IncidentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "">("");
  const [filterCategory, setFilterCategory] = useState<Category | "">("");
  const [exporting, setExporting] = useState(false);

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

  async function handleExport() {
    setExporting(true);
    try {
      await downloadIncidentsExcel({
        status: filterStatus || undefined,
        category: filterCategory || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd eksportu");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Zgłoszenia</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {exporting ? "Eksportowanie..." : "Eksport Excel"}
          </button>
          <Link
            to="/report"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zdarzenia-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zdarzenia-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            + Zgłoś zdarzenie
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Status | "")}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 text-center text-gray-400">
          Ładowanie...
        </div>
      ) : (
        <IncidentList items={items} total={total} />
      )}
    </div>
  );
}
