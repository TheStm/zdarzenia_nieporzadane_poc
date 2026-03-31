import { Link } from "react-router-dom";
import type { PendingAction } from "../../api/dashboard";

interface Props {
  actions: PendingAction[];
}

function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

function daysUntil(deadline: string): number {
  const diff = new Date(deadline).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function PendingActionsPanel({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Działania naprawcze</h3>
        <p className="text-gray-400 text-sm text-center py-4">Brak oczekujących działań</p>
      </div>
    );
  }

  const overdue = actions.filter((a) => isOverdue(a.deadline));
  const upcoming = actions.filter((a) => !isOverdue(a.deadline));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Działania naprawcze</h3>
        <div className="flex gap-1">
          {overdue.length > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">{overdue.length} przeterminowanych</span>
          )}
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{actions.length} otwartych</span>
        </div>
      </div>
      <div className="space-y-2">
        {actions.map((action) => {
          const overdueBool = isOverdue(action.deadline);
          const days = daysUntil(action.deadline);
          return (
            <Link to={`/incidents/${action.incident_id}`} key={action.action_id}
              className={`block p-3 rounded-lg border transition-colors ${overdueBool ? "border-red-200 bg-red-50 hover:border-red-300" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 truncate">{action.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{action.responsible_person}</span>
                    <span>·</span>
                    <span>{action.department}</span>
                    <span>·</span>
                    <span>ZN-{String(action.incident_id).padStart(4, "0")}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-medium ${overdueBool ? "text-red-600" : days <= 7 ? "text-amber-600" : "text-gray-500"}`}>
                    {overdueBool ? `${Math.abs(days)} dni po terminie` : days === 0 ? "Dzisiaj" : `za ${days} dni`}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(action.deadline).toLocaleDateString("pl-PL")}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
