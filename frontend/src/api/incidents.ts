import type {
  Incident,
  IncidentCreate,
  IncidentListResponse,
  Status,
  Category,
} from "../types/incident";

const BASE = "/api/incidents";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }
  return response.json() as Promise<T>;
}

export async function createIncident(data: IncidentCreate): Promise<Incident> {
  const response = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Incident>(response);
}

export async function getIncident(id: number): Promise<Incident> {
  const response = await fetch(`${BASE}/${id}`);
  return handleResponse<Incident>(response);
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
  const response = await fetch(url);
  return handleResponse<IncidentListResponse>(response);
}

export async function updateIncidentStatus(
  id: number,
  status: Status
): Promise<Incident> {
  const response = await fetch(`${BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Incident>(response);
}
