import type {
  Incident,
  IncidentCreate,
  IncidentListResponse,
  Status,
  Category,
} from "../types/incident";
import { apiFetch, getToken, removeToken } from "./client";

const BASE = "/api/incidents";

export async function createIncident(data: IncidentCreate): Promise<Incident> {
  return apiFetch<Incident>(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getIncident(id: number): Promise<Incident> {
  return apiFetch<Incident>(`${BASE}/${id}`);
}

export async function listIncidents(params?: {
  status?: Status;
  category?: Category;
  skip?: number;
  limit?: number;
}): Promise<IncidentListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params?.limit !== undefined)
    searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const url = query ? `${BASE}?${query}` : BASE;
  return apiFetch<IncidentListResponse>(url);
}

export async function downloadIncidentsExcel(params?: {
  status?: Status;
  category?: Category;
}): Promise<void> {
  const token = getToken();
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.category) query.set("category", params.category);

  const url = `/api/export/incidents.xlsx${query.toString() ? `?${query}` : ""}`;
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`Błąd eksportu: ${response.status}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = "zdarzenia_niepozadane.xlsx";
  a.click();
  URL.revokeObjectURL(objectUrl);
}

export async function updateIncidentStatus(
  id: number,
  status: Status
): Promise<Incident> {
  return apiFetch<Incident>(`${BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
