export type EventType = "ZN" | "ZN-0" | "NZN";

export type Category =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G"
  | "H" | "I" | "J" | "K" | "L" | "M" | "X";

export type Severity = 0 | 1 | 2 | 3 | 4;

export type Status =
  | "new"
  | "in_triage"
  | "rejected"
  | "in_analysis"
  | "escalated_rca"
  | "action_plan"
  | "implementing"
  | "closed";

export interface IncidentCreate {
  event_type: EventType;
  event_date: string;
  department: string;
  location?: string;
  category: Category;
  subcategory?: string;
  description: string;
  severity: Severity;
  immediate_actions_taken: boolean;
  immediate_actions_desc?: string;
  preventive_suggestions?: string;
  patient_age?: number;
  patient_sex?: string;
  reporter_anonymous: boolean;
  reporter_name?: string;
  reporter_role?: string;
}

export interface Incident extends IncidentCreate {
  id: number;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface IncidentListItem {
  id: number;
  event_type: EventType;
  event_date: string;
  department: string;
  category: Category;
  severity: Severity;
  status: Status;
  created_at: string;
}

export interface IncidentListResponse {
  items: IncidentListItem[];
  total: number;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  ZN: "Zdarzenie ze szkodą",
  "ZN-0": "Zdarzenie bez szkody",
  NZN: "Zdarzenie niedoszłe (near-miss)",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  A: "Procedury kliniczne",
  B: "Farmakoterapia",
  C: "Zakażenia szpitalne",
  D: "Sprzęt medyczny",
  E: "Upadki pacjentów",
  F: "Odleżyny",
  G: "Krew i preparaty krwiopochodne",
  H: "Opieka nad pacjentem",
  I: "Dokumentacja",
  J: "Samouszkodzenie / zachowanie",
  K: "Infrastruktura / środowisko",
  L: "Organizacja pracy",
  M: "Prawa pacjenta",
  X: "Inne",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  0: "Brak szkody",
  1: "Minimalna",
  2: "Umiarkowana",
  3: "Poważna",
  4: "Krytyczna / zgon",
};

export const STATUS_LABELS: Record<Status, string> = {
  new: "Nowe",
  in_triage: "W triage",
  rejected: "Odrzucone",
  in_analysis: "W analizie",
  escalated_rca: "Eskalowane do RCA",
  action_plan: "Plan działań",
  implementing: "Wdrażanie",
  closed: "Zamknięte",
};
