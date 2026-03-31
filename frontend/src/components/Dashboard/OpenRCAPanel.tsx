import { Link } from "react-router-dom";
import type { OpenRCA } from "../../api/dashboard";
import { CATEGORY_LABELS } from "../../types/incident";
import type { Category, Severity } from "../../types/incident";
import { RCA_STATUS_LABELS } from "../../types/rca";
import type { RCAStatus } from "../../types/rca";

const RCA_BADGE: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const SEVERITY_DOT: Record<Severity, string> = {
  0: "bg-gray-400", 1: "bg-green-400", 2: "bg-amber-400", 3: "bg-red-400", 4: "bg-red-600",
};

interface Props {
  rcas: OpenRCA[];
}

export function OpenRCAPanel({ rcas }: Props) {
  if (rcas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Otwarte analizy RCA</h3>
        <p className="text-gray-400 text-sm text-center py-4">Brak otwartych analiz RCA</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Otwarte analizy RCA</h3>
        <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">{rcas.length}</span>
      </div>
      <div className="space-y-3">
        {rcas.map((rca) => {
          const progress = rca.total_actions > 0 ? (rca.completed_actions / rca.total_actions) * 100 : 0;
          return (
            <Link to={`/incidents/${rca.incident_id}`} key={rca.rca_id} className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[rca.severity as Severity]}`} />
                  <span className="text-sm font-medium text-gray-900">ZN-{String(rca.incident_id).padStart(4, "0")}</span>
                  <span className="text-xs text-gray-500">{rca.department}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${RCA_BADGE[rca.rca_status]}`}>
                  {RCA_STATUS_LABELS[rca.rca_status as RCAStatus] ?? rca.rca_status}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {CATEGORY_LABELS[rca.category as Category]} {rca.team_members ? `· ${rca.team_members}` : ""}
              </div>
              {rca.total_actions > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{rca.completed_actions}/{rca.total_actions}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
