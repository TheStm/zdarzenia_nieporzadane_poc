import { CATEGORY_LABELS } from "../../types/incident";
import type { Category } from "../../types/incident";

interface Props {
  data: Record<string, number>;
}

export function CategoryChart({ data }: Props) {
  const entries = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);

  if (entries.length === 0) return null;

  const max = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top kategorie</h3>
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{CATEGORY_LABELS[key as Category] ?? key}</span>
              <span className="font-medium">{value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
