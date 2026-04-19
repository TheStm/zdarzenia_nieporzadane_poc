import { SEVERITY_LABELS } from "../../types/incident";
import type { Severity } from "../../types/incident";

interface Props {
  bySeverity: Record<string, number>;
}

const COLORS: Record<string, string> = {
  "0": "bg-gray-100 text-gray-600",
  "1": "bg-green-100 text-green-700",
  "2": "bg-amber-100 text-amber-700",
  "3": "bg-red-100 text-red-700",
  "4": "bg-red-300 text-red-900 font-bold",
};

export function RiskMatrix({ bySeverity }: Props) {
  const severities: Severity[] = [4, 3, 2, 1, 0];
  const total = Object.values(bySeverity).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Rozkład ciężkości</h3>
      <div className="space-y-2">
        {severities.map((sev) => {
          const count = bySeverity[String(sev)] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={sev} className="flex items-center gap-3">
              <div className="w-24 text-xs text-gray-600 text-right shrink-0">
                {SEVERITY_LABELS[sev]}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all flex items-center justify-end pr-2 ${COLORS[String(sev)]}`}
                  style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                >
                  {count > 0 && <span className="text-xs font-medium">{count}</span>}
                </div>
              </div>
              <div className="w-10 text-xs text-gray-400 text-right">{pct.toFixed(0)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
