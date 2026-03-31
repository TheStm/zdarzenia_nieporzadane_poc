import type { IncidentCreate } from "../../types/incident";
import { EVENT_TYPE_LABELS, CATEGORY_LABELS, SEVERITY_LABELS } from "../../types/incident";
import type { EventType, Category, Severity } from "../../types/incident";

interface Props {
  data: Partial<IncidentCreate>;
}

export function StepSummary({ data }: Props) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-gray-900 mb-4">Podsumowanie zgłoszenia</legend>
      <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
        <Row label="Typ zdarzenia" value={data.event_type ? EVENT_TYPE_LABELS[data.event_type as EventType] : "—"} />
        <Row label="Data" value={data.event_date ?? "—"} />
        <Row label="Oddział" value={data.department ?? "—"} />
        <Row label="Lokalizacja" value={data.location || "—"} />
        <Row label="Kategoria" value={data.category ? CATEGORY_LABELS[data.category as Category] : "—"} />
        <Row label="Opis" value={data.description ?? "—"} />
        <Row label="Ciężkość" value={data.severity !== undefined ? SEVERITY_LABELS[data.severity as Severity] : "—"} />
        <Row label="Działania podjęte" value={data.immediate_actions_taken ? "Tak" : "Nie"} />
        {data.immediate_actions_desc && <Row label="Opis działań" value={data.immediate_actions_desc} />}
        <Row label="Zgłaszający" value={data.reporter_anonymous ? "Anonimowo" : (data.reporter_name || "—")} />
      </div>
      <p className="text-sm text-gray-500 mt-4">Sprawdź poprawność danych i kliknij "Wyślij zgłoszenie".</p>
    </fieldset>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex py-3 px-4">
      <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
