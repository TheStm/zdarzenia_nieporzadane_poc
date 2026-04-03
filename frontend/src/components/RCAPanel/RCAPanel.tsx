import { useState } from "react";
import type { RCAAnalysis, RCAStatus } from "../../types/rca";
import { RCA_STATUS_LABELS } from "../../types/rca";
import { createRCA, updateRCA } from "../../api/rca";
import { ActionList } from "./ActionList";

const RCA_STATUS_BADGE: Record<RCAStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

interface Props {
  incidentId: number;
  rca: RCAAnalysis | null;
  onUpdate: () => void;
}

export function RCAPanel({ incidentId, rca, onUpdate }: Props) {
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    description: rca?.description ?? "",
    root_causes: rca?.root_causes ?? "",
    contributing_factors: rca?.contributing_factors ?? "",
    recommendations: rca?.recommendations ?? "",
    team_members: rca?.team_members ?? "",
  });

  async function handleCreate() {
    setCreating(true);
    try {
      await createRCA(incidentId, { description: "", team_members: "" });
      onUpdate();
    } finally {
      setCreating(false);
    }
  }

  async function handleSave() {
    if (!rca) return;
    setSaving(true);
    try {
      await updateRCA(rca.id, form);
      onUpdate();
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(status: RCAStatus) {
    if (!rca) return;
    setSaving(true);
    try {
      await updateRCA(rca.id, { ...form, status });
      onUpdate();
    } finally {
      setSaving(false);
    }
  }

  if (!rca) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">Brak analizy RCA dla tego zdarzenia.</p>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex h-10 items-center justify-center rounded-md bg-zdarzenia-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zdarzenia-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {creating ? "Tworzenie..." : "Rozpocznij analizę RCA"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RCA Header */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Analiza przyczyn źródłowych (RCA)</h3>
          <span className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors ${RCA_STATUS_BADGE[rca.status]}`}>
            {RCA_STATUS_LABELS[rca.status]}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Zespół analizujący</label>
            <input
              type="text" value={form.team_members}
              onChange={(e) => setForm((f) => ({ ...f, team_members: e.target.value }))}
              className={inputClass} placeholder="np. Dr Nowak, Mgr Kowalska, Mgr Wiśniewski"
            />
          </div>
          <div>
            <label className={labelClass}>Opis sytuacji</label>
            <textarea
              value={form.description} rows={3}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputClass} placeholder="Opis kontekstu i przebiegu zdarzenia..."
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="root_causes">Przyczyny źródłowe</label>
            <textarea
              id="root_causes" value={form.root_causes} rows={4}
              onChange={(e) => setForm((f) => ({ ...f, root_causes: e.target.value }))}
              className={inputClass} placeholder="Zidentyfikowane przyczyny źródłowe (np. brak procedury weryfikacji, przeciążenie personelu)..."
            />
          </div>
          <div>
            <label className={labelClass}>Czynniki przyczyniające się</label>
            <textarea
              value={form.contributing_factors} rows={3}
              onChange={(e) => setForm((f) => ({ ...f, contributing_factors: e.target.value }))}
              className={inputClass} placeholder="Czynniki: ludzki, organizacyjny, techniczny, środowiskowy..."
            />
          </div>
          <div>
            <label className={labelClass}>Rekomendacje</label>
            <textarea
              value={form.recommendations} rows={3}
              onChange={(e) => setForm((f) => ({ ...f, recommendations: e.target.value }))}
              className={inputClass} placeholder="Zalecane działania naprawcze i zapobiegawcze..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={handleSave} disabled={saving}
            className="inline-flex h-10 items-center justify-center rounded-md bg-zdarzenia-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zdarzenia-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            {saving ? "Zapisywanie..." : "Zapisz"}
          </button>
          {rca.status === "draft" && (
            <button onClick={() => handleStatusChange("in_progress")} disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Rozpocznij analizę
            </button>
          )}
          {rca.status === "in_progress" && (
            <button onClick={() => handleStatusChange("completed")} disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Zakończ analizę
            </button>
          )}
        </div>
      </div>

      {/* Action Items */}
      <ActionList rcaId={rca.id} />
    </div>
  );
}
