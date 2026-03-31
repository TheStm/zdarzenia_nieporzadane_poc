import type { RCAAnalysis, RCACreate, RCAUpdate, ActionItem, ActionItemCreate, ActionItemUpdate } from "../types/rca";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }
  return response.json() as Promise<T>;
}

export async function createRCA(incidentId: number, data: RCACreate): Promise<RCAAnalysis> {
  const r = await fetch(`/api/incidents/${incidentId}/rca`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return handleResponse<RCAAnalysis>(r);
}

export async function getRCA(incidentId: number): Promise<RCAAnalysis | null> {
  const r = await fetch(`/api/incidents/${incidentId}/rca`);
  if (r.status === 404) return null;
  return handleResponse<RCAAnalysis>(r);
}

export async function updateRCA(rcaId: number, data: RCAUpdate): Promise<RCAAnalysis> {
  const r = await fetch(`/api/rca/${rcaId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return handleResponse<RCAAnalysis>(r);
}

export async function createAction(rcaId: number, data: ActionItemCreate): Promise<ActionItem> {
  const r = await fetch(`/api/rca/${rcaId}/actions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return handleResponse<ActionItem>(r);
}

export async function listActions(rcaId: number): Promise<ActionItem[]> {
  const r = await fetch(`/api/rca/${rcaId}/actions`);
  return handleResponse<ActionItem[]>(r);
}

export async function updateAction(actionId: number, data: ActionItemUpdate): Promise<ActionItem> {
  const r = await fetch(`/api/actions/${actionId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return handleResponse<ActionItem>(r);
}
