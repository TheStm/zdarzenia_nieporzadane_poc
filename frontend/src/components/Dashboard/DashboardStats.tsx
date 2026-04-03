import type { IncidentListItem, Severity } from "../../types/incident";

interface Props {
  items: IncidentListItem[];
  total: number;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  testId?: string;
}

function StatCard({ label, value, color, testId }: StatCardProps) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 ${color} p-5 flex-1 min-w-[140px]`}>
      <div className="text-3xl font-bold text-gray-900" data-testid={testId}>
        {value}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export function DashboardStats({ items, total }: Props) {
  const openCount = items.filter(
    (i) => i.status !== "closed" && i.status !== "rejected"
  ).length;
  const severeCount = items.filter((i) => (i.severity as Severity) >= 3).length;
  const newCount = items.filter((i) => i.status === "new").length;

  return (
    <div className="flex gap-4 flex-wrap mb-6">
      <StatCard label="Łącznie zgłoszeń" value={total} color="border-zdarzenia-500" />
      <StatCard label="Otwartych" value={openCount} color="border-amber-500" testId="open-count" />
      <StatCard label="Poważne / krytyczne" value={severeCount} color="border-red-500" testId="severity-high-count" />
      <StatCard label="Nowe (do triage)" value={newCount} color="border-green-500" />
    </div>
  );
}
