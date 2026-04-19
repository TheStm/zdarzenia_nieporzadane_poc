import { Link } from "react-router-dom";
import type { RecentIncident } from "../../api/dashboard";
import { CATEGORY_LABELS, SEVERITY_LABELS, STATUS_LABELS } from "../../types/incident";
import type { Category, EventType, Severity, Status } from "../../types/incident";

const SEVERITY_DOT: Record<Severity, string> = {
  0: "bg-gray-400", 1: "bg-green-400", 2: "bg-amber-400", 3: "bg-red-400", 4: "bg-red-600",
};

const EVENT_ICON: Record<EventType, string> = {
  ZN: "!",
  "ZN-0": "~",
  NZN: "\u2713",
};

interface Props {
  incidents: RecentIncident[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "przed chwilą";
  if (hours < 24) return `${hours}h temu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "wczoraj";
  return `${days} dni temu`;
}

export function ActivityFeed({ incidents }: Props) {
  if (incidents.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Ostatnie zgłoszenia</h3>
      <div className="space-y-0 divide-y divide-gray-100">
        {incidents.map((inc) => (
          <Link to={`/incidents/${inc.id}`} key={inc.id} className="flex items-start gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 ${
              inc.severity >= 3 ? "bg-red-500" : inc.severity >= 2 ? "bg-amber-500" : inc.severity >= 1 ? "bg-green-500" : "bg-gray-400"
            }`}>
              {EVENT_ICON[inc.event_type as EventType]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">ZN-{String(inc.id).padStart(4, "0")}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[inc.severity as Severity]}`} />
                <span className="text-xs text-gray-500">{SEVERITY_LABELS[inc.severity as Severity]}</span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5 truncate">{inc.description}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span>{inc.department}</span>
                <span>·</span>
                <span>{CATEGORY_LABELS[inc.category as Category]}</span>
                <span>·</span>
                <span>{STATUS_LABELS[inc.status as Status]}</span>
                <span>·</span>
                <span>{timeAgo(inc.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
