import type { RCAAnalysis, RCACreate, RCAUpdate, ActionItem, ActionItemCreate, ActionItemUpdate } from "../types/rca";
import { apiFetch } from "./client";

export async function createRCA(incidentId: number, data: RCACreate): Promise<RCAAnalysis> {
  return apiFetch<RCAAnalysis>(`/api/incidents/${incidentId}/rca`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getRCA(incidentId: number): Promise<RCAAnalysis | null> {
  try {
    return await apiFetch<RCAAnalysis>(`/api/incidents/${incidentId}/rca`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("404")) return null;
    throw e;
  }
}

export async function updateRCA(rcaId: number, data: RCAUpdate): Promise<RCAAnalysis> {
  return apiFetch<RCAAnalysis>(`/api/rca/${rcaId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function createAction(rcaId: number, data: ActionItemCreate): Promise<ActionItem> {
  return apiFetch<ActionItem>(`/api/rca/${rcaId}/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function listActions(rcaId: number): Promise<ActionItem[]> {
  return apiFetch<ActionItem[]>(`/api/rca/${rcaId}/actions`);
}

export async function updateAction(actionId: number, data: ActionItemUpdate): Promise<ActionItem> {
  return apiFetch<ActionItem>(`/api/actions/${actionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
