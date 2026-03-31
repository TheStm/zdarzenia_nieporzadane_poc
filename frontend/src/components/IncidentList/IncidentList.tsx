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
      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
        Brak zgłoszeń
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">
        Łącznie: {total}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Typ</th>
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Oddział</th>
              <th className="px-5 py-3">Kategoria</th>
              <th className="px-5 py-3">Ciężkość</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <Link to={`/incidents/${item.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    ZN-{String(item.id).padStart(4, "0")}
                  </Link>
                </td>
                <td className="px-5 py-3 text-sm">
                  {EVENT_TYPE_LABELS[item.event_type as EventType]}
                </td>
                <td className="px-5 py-3 text-sm text-gray-600">
                  {new Date(item.event_date).toLocaleDateString("pl-PL")}
                </td>
                <td className="px-5 py-3 text-sm">{item.department}</td>
                <td className="px-5 py-3 text-sm">
                  {CATEGORY_LABELS[item.category as Category]}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${SEVERITY_BADGE[item.severity as Severity]}`}>
                    {SEVERITY_LABELS[item.severity as Severity]}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${STATUS_BADGE[item.status as Status]}`}>
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
