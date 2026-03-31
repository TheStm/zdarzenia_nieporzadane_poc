import type { EventType } from "../../types/incident";
import { EVENT_TYPE_LABELS } from "../../types/incident";

interface Props {
  value: EventType | undefined;
  onChange: (value: EventType) => void;
  error?: string;
}

const EVENT_TYPES: { type: EventType; desc: string; color: string }[] = [
  { type: "ZN", desc: "Zdarzenie dotarło do pacjenta i wyrządziło szkodę", color: "border-red-300 bg-red-50" },
  { type: "ZN-0", desc: "Zdarzenie dotarło do pacjenta, ale nie wyrządziło szkody", color: "border-amber-300 bg-amber-50" },
  { type: "NZN", desc: "Zapobieżone przed dotarciem do pacjenta", color: "border-gray-300 bg-gray-50" },
];

export function StepEventType({ value, onChange, error }: Props) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-gray-900 mb-4">Typ zdarzenia</legend>
      <div className="space-y-3">
        {EVENT_TYPES.map(({ type, desc, color }) => (
          <label
            key={type}
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              value === type ? `${color} ring-2 ring-blue-500` : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="event_type"
              value={type}
              checked={value === type}
              onChange={() => onChange(type)}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-gray-900">{EVENT_TYPE_LABELS[type]}</div>
              <div className="text-sm text-gray-500 mt-0.5">{desc}</div>
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </fieldset>
  );
}
