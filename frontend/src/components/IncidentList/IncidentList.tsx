import { Link } from "react-router-dom";
import type { IncidentListItem } from "../../types/incident";
import {
  EVENT_TYPE_LABELS,
  CATEGORY_LABELS,
  SEVERITY_LABELS,
  STATUS_LABELS,
} from "../../types/incident";
import type { EventType, Category, Severity, Status } from "../../types/incident";

const SEVERITY_BADGE: Record<Severity, string> = {
  0: "bg-gray-100 text-gray-700",
  1: "bg-green-100 text-green-700",
  2: "bg-amber-100 text-amber-700",
  3: "bg-red-100 text-red-700",
  4: "bg-red-200 text-red-900 font-semibold",
};

const STATUS_BADGE: Record<Status, string> = {
  new: "bg-blue-100 text-blue-700",
  in_triage: "bg-yellow-100 text-yellow-700",
  rejected: "bg-gray-100 text-gray-500",
  in_analysis: "bg-purple-100 text-purple-700",
  escalated_rca: "bg-orange-100 text-orange-700",
  action_plan: "bg-indigo-100 text-indigo-700",
  implementing: "bg-cyan-100 text-cyan-700",
  closed: "bg-green-100 text-green-700",
};

interface Props {
  items: IncidentListItem[];
  total: number;
}

export function IncidentList({ items, total }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 text-center text-gray-400">
        Brak zgłoszeń
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">
        Łącznie: {total}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">#</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Typ</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Oddział</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kategoria</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ciężkość</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {items.map((item) => (
              <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  <Link to={`/incidents/${item.id}`} className="text-zdarzenia-600 hover:text-zdarzenia-800 font-medium">
                    ZN-{String(item.id).padStart(4, "0")}
                  </Link>
                </td>
                <td className="p-4 align-middle">
                  {EVENT_TYPE_LABELS[item.event_type as EventType]}
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {new Date(item.event_date).toLocaleDateString("pl-PL")}
                </td>
                <td className="p-4 align-middle">{item.department}</td>
                <td className="p-4 align-middle">
                  {CATEGORY_LABELS[item.category as Category]}
                </td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors ${SEVERITY_BADGE[item.severity as Severity]}`}>
                    {SEVERITY_LABELS[item.severity as Severity]}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors ${STATUS_BADGE[item.status as Status]}`}>
                    {STATUS_LABELS[item.status as Status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
