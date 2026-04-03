import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getIncident, updateIncidentStatus } from "../api/incidents";
import { getRCA } from "../api/rca";
import type { Incident, Status } from "../types/incident";
import type { RCAAnalysis } from "../types/rca";
import {
  EVENT_TYPE_LABELS, CATEGORY_LABELS, SEVERITY_LABELS, STATUS_LABELS,
} from "../types/incident";
import type { EventType, Category, Severity } from "../types/incident";
import { RCAPanel } from "../components/RCAPanel/RCAPanel";
import { useAuth } from "../context/AuthContext";

const SEVERITY_BADGE: Record<Severity, string> = {
  0: "bg-gray-100 text-gray-700", 1: "bg-green-100 text-green-700",
  2: "bg-amber-100 text-amber-700", 3: "bg-red-100 text-red-700",
  4: "bg-red-200 text-red-900 font-semibold",
};

const STATUS_BADGE: Record<Status, string> = {
  new: "bg-blue-100 text-blue-700", in_triage: "bg-yellow-100 text-yellow-700",
  rejected: "bg-gray-100 text-gray-500", in_analysis: "bg-purple-100 text-purple-700",
  escalated_rca: "bg-orange-100 text-orange-700", action_plan: "bg-indigo-100 text-indigo-700",
  implementing: "bg-cyan-100 text-cyan-700", closed: "bg-green-100 text-green-700",
};

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isStaff = user?.role === "coordinator" || user?.role === "admin";

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"details" | "rca">("details");
  const [rca, setRca] = useState<RCAAnalysis | null>(null);

  const loadData = useCallback(() => {
    if (!id) return;
    const promises: [Promise<Incident>, Promise<RCAAnalysis | null>] = [
      getIncident(Number(id)),
      isStaff ? getRCA(Number(id)) : Promise.resolve(null),
    ];
    Promise.all(promises)
      .then(([inc, rcaData]) => {
        setIncident(inc);
        setRca(rcaData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Błąd"))
      .finally(() => setLoading(false));
  }, [id, isStaff]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleStatusChange(newStatus: Status) {
    if (!incident) return;
    try {
      const updated = await updateIncidentStatus(incident.id, newStatus);
      setIncident(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd zmiany statusu");
    }
  }

  const backLink = user?.role === "reporter" ? "/my-incidents" : "/incidents";

  if (loading) return <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">Ładowanie...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
  if (!incident) return <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">Nie znaleziono zgłoszenia</div>;

  return (
    <div>
      <Link to={backLink} className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">{"\u2190"} Wróć do listy</Link>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ZN-{String(incident.id).padStart(4, "0")}</h1>
        <span className={`px-3 py-1 rounded-full text-sm ${SEVERITY_BADGE[incident.severity as Severity]}`}>
          {SEVERITY_LABELS[incident.severity as Severity]}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm ${STATUS_BADGE[incident.status as Status]}`}>
          {STATUS_LABELS[incident.status as Status]}
        </span>
      </div>

      {/* Status change — only for coordinator/admin */}
      {isStaff && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Zmień status:</span>
          <select
            value={incident.status}
            onChange={(e) => handleStatusChange(e.target.value as Status)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tabs — RCA tab only for staff */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setTab("details")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "details" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Szczegóły
        </button>
        {isStaff && (
          <button
            onClick={() => setTab("rca")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "rca" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            RCA i Działania
          </button>
        )}
      </div>

      {tab === "details" && (
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          <Row label="Typ zdarzenia" value={EVENT_TYPE_LABELS[incident.event_type as EventType]} />
          <Row label="Data zdarzenia" value={new Date(incident.event_date).toLocaleString("pl-PL")} />
          <Row label="Oddział" value={incident.department} />
          <Row label="Lokalizacja" value={incident.location ?? "—"} />
          <Row label="Kategoria" value={CATEGORY_LABELS[incident.category as Category]} />
          <Row label="Opis" value={incident.description} />
          <Row label="Działania podjęte" value={incident.immediate_actions_taken ? "Tak" : "Nie"} />
          {incident.immediate_actions_desc && <Row label="Opis działań" value={incident.immediate_actions_desc} />}
          {incident.preventive_suggestions && <Row label="Propozycje zapobiegawcze" value={incident.preventive_suggestions} />}
          <Row label="Wiek pacjenta" value={incident.patient_age?.toString() ?? "—"} />
          <Row label="Płeć" value={incident.patient_sex ?? "—"} />
          <Row label="Zgłaszający" value={incident.reporter_anonymous ? "Anonimowo" : (incident.reporter_name ?? "—")} />
          {!incident.reporter_anonymous && incident.reporter_role && <Row label="Rola" value={incident.reporter_role} />}
          <Row label="Zgłoszono" value={new Date(incident.created_at).toLocaleString("pl-PL")} />
        </div>
      )}

      {tab === "rca" && isStaff && (
        <RCAPanel incidentId={incident.id} rca={rca} onUpdate={loadData} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex py-3 px-5">
      <dt className="w-48 shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
