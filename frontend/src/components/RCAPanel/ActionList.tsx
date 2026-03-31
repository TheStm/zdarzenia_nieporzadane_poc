import { useEffect, useState } from "react";
import type { ActionItem, ActionItemCreate, ActionStatus } from "../../types/rca";
import { ACTION_STATUS_LABELS } from "../../types/rca";
import { listActions, createAction, updateAction } from "../../api/rca";

const ACTION_BADGE: Record<ActionStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

interface Props {
  rcaId: number;
}

export function ActionList({ rcaId }: Props) {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ActionItemCreate>({ description: "", responsible_person: "", deadline: "" });
  const [saving, setSaving] = useState(false);

  function loadActions() {
    listActions(rcaId).then(setActions);
  }

  useEffect(() => { loadActions(); }, [rcaId]);

  async function handleAdd() {
    if (!form.description || !form.responsible_person || !form.deadline) return;
    setSaving(true);
    try {
      await createAction(rcaId, form);
      setForm({ description: "", responsible_person: "", deadline: "" });
      setShowForm(false);
      loadActions();
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(actionId: number, status: ActionStatus) {
    await updateAction(actionId, { status, completion_notes: status === "completed" ? `Zrealizowano ${new Date().toLocaleDateString("pl-PL")}` : undefined });
    loadActions();
  }

  const completedCount = actions.filter((a) => a.status === "completed").length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Działania naprawcze
          {actions.length > 0 && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              {completedCount}/{actions.length} zrealizowanych
            </span>
          )}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
        >
          + Dodaj działanie
        </button>
      </div>

      {/* Progress bar */}
      {actions.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedCount / actions.length) * 100}%` }}
          />
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <input type="text" placeholder="Opis działania" value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Osoba odpowiedzialna" value={form.responsible_person}
              onChange={(e) => setForm((f) => ({ ...f, responsible_person: e.target.value }))} className={inputClass} />
            <input type="date" value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className={inputClass} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {saving ? "Dodawanie..." : "Dodaj"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Action items list */}
      {actions.length === 0 && !showForm && (
        <p className="text-gray-400 text-sm text-center py-4">Brak działań naprawczych. Dodaj pierwsze działanie.</p>
      )}

      <div className="space-y-2">
        {actions.map((action) => (
          <div key={action.id} className={`flex items-start gap-3 p-3 rounded-lg border ${action.status === "completed" ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
            <button
              onClick={() => handleStatusChange(action.id, action.status === "completed" ? "todo" : "completed")}
              className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                action.status === "completed" ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-500"
              }`}
            >
              {action.status === "completed" && <span className="text-xs">{"\u2713"}</span>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${action.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                {action.description}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{action.responsible_person}</span>
                <span>Termin: {new Date(action.deadline).toLocaleDateString("pl-PL")}</span>
                <span className={`px-1.5 py-0.5 rounded ${ACTION_BADGE[action.status]}`}>
                  {ACTION_STATUS_LABELS[action.status]}
                </span>
              </div>
            </div>
            {action.status !== "completed" && (
              <select
                value={action.status}
                onChange={(e) => handleStatusChange(action.id, e.target.value as ActionStatus)}
                className="text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="todo">Do zrobienia</option>
                <option value="in_progress">W toku</option>
                <option value="completed">Zrealizowane</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
