export type RCAStatus = "draft" | "in_progress" | "completed";
export type ActionStatus = "todo" | "in_progress" | "completed" | "overdue";

export interface RCAAnalysis {
  id: number;
  incident_id: number;
  status: RCAStatus;
  description: string | null;
  root_causes: string | null;
  contributing_factors: string | null;
  recommendations: string | null;
  team_members: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface RCACreate {
  description?: string;
  team_members?: string;
}

export interface RCAUpdate {
  status?: RCAStatus;
  description?: string;
  root_causes?: string;
  contributing_factors?: string;
  recommendations?: string;
  team_members?: string;
}

export interface ActionItem {
  id: number;
  rca_id: number;
  description: string;
  responsible_person: string;
  deadline: string;
  status: ActionStatus;
  completion_notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface ActionItemCreate {
  description: string;
  responsible_person: string;
  deadline: string;
}

export interface ActionItemUpdate {
  description?: string;
  responsible_person?: string;
  deadline?: string;
  status?: ActionStatus;
  completion_notes?: string;
}

export const RCA_STATUS_LABELS: Record<RCAStatus, string> = {
  draft: "Szkic",
  in_progress: "W toku",
  completed: "Zakończona",
};

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  todo: "Do zrobienia",
  in_progress: "W toku",
  completed: "Zrealizowane",
  overdue: "Przeterminowane",
};
