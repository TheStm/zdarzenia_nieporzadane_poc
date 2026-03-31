export interface OpenRCA {
  rca_id: number;
  incident_id: number;
  rca_status: string;
  department: string;
  category: string;
  severity: number;
  team_members: string | null;
  created_at: string;
  total_actions: number;
  completed_actions: number;
}

export interface PendingAction {
  action_id: number;
  description: string;
  responsible_person: string;
  deadline: string;
  status: string;
  incident_id: number;
  department: string;
}

export interface RecentIncident {
  id: number;
  event_type: string;
  department: string;
  category: string;
  severity: number;
  status: string;
  description: string;
  created_at: string;
}

export interface DashboardStatsData {
  total: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  by_severity: Record<string, number>;
  by_month: { year: number; month: number; count: number }[];
  open_rcas: OpenRCA[];
  pending_actions: PendingAction[];
  recent_incidents: RecentIncident[];
}

export async function fetchDashboardStats(): Promise<DashboardStatsData> {
  const r = await fetch("/api/dashboard/stats");
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json() as Promise<DashboardStatsData>;
}
