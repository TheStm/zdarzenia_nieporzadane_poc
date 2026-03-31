import type { Severity } from "../../types/incident";
import { SEVERITY_LABELS } from "../../types/incident";

interface Props {
  severity: Severity | undefined;
  actionsTaken: boolean;
  actionsDesc: string;
  preventive: string;
  onChangeSeverity: (v: Severity) => void;
  onChangeActionsTaken: (v: boolean) => void;
  onChangeActionsDesc: (v: string) => void;
  onChangePreventive: (v: string) => void;
  error?: string;
}

const SEVERITY_COLORS: Record<number, string> = {
  0: "border-gray-300 bg-gray-50",
  1: "border-green-300 bg-green-50",
  2: "border-amber-300 bg-amber-50",
  3: "border-red-300 bg-red-50",
  4: "border-red-400 bg-red-100",
};

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";
const errorClass = "text-red-600 text-sm mt-1";

export function StepConsequences({ severity, actionsTaken, actionsDesc, preventive, onChangeSeverity, onChangeActionsTaken, onChangeActionsDesc, onChangePreventive, error }: Props) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-gray-900 mb-4">Skutki i działania</legend>

      <p className="text-sm font-medium text-gray-700 mb-3">Ciężkość skutku</p>
      <div className="space-y-2 mb-6">
        {Object.entries(SEVERITY_LABELS).map(([val, label]) => (
          <label
            key={val}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              severity === Number(val) ? `${SEVERITY_COLORS[Number(val)]} ring-2 ring-blue-500` : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="severity"
              value={val}
              checked={severity === Number(val)}
              onChange={() => onChangeSeverity(Number(val) as Severity)}
            />
            <span className="text-sm"><strong>{val}</strong> — {label}</span>
          </label>
        ))}
      </div>
      {error && <p className={errorClass}>{error}</p>}

      <label className="flex items-center gap-2 mt-4 mb-3 cursor-pointer">
        <input type="checkbox" checked={actionsTaken} onChange={(e) => onChangeActionsTaken(e.target.checked)} className="rounded" />
        <span className="text-sm font-medium text-gray-700">Podjęto działania natychmiastowe</span>
      </label>

      {actionsTaken && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Opis podjętych działań</label>
          <textarea value={actionsDesc} onChange={(e) => onChangeActionsDesc(e.target.value)} rows={3} className={inputClass} />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Proponowane działania zapobiegawcze (opcjonalne)</label>
        <textarea value={preventive} onChange={(e) => onChangePreventive(e.target.value)} rows={3} className={inputClass} />
      </div>
    </fieldset>
  );
}
