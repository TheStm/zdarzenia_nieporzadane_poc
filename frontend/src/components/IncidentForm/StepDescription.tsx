import type { Category } from "../../types/incident";
import { CATEGORY_LABELS } from "../../types/incident";

interface Props {
  category: Category | undefined;
  subcategory: string;
  description: string;
  onChangeCategory: (v: Category) => void;
  onChangeSubcategory: (v: string) => void;
  onChangeDescription: (v: string) => void;
  errors: Record<string, string>;
}

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];
const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const errorClass = "text-red-600 text-sm mt-1";

export function StepDescription({ category, description, onChangeCategory, onChangeDescription, errors }: Props) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-gray-900 mb-4">Co się wydarzyło</legend>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Kategoria zdarzenia</label>
          <select value={category ?? ""} onChange={(e) => onChangeCategory(e.target.value as Category)} className={inputClass}>
            <option value="">— wybierz kategorię —</option>
            {CATEGORIES.map(([code, label]) => (
              <option key={code} value={code}>{code}. {label}</option>
            ))}
          </select>
          {errors.category && <p className={errorClass}>{errors.category}</p>}
        </div>
        <div>
          <label className={labelClass}>Opis zdarzenia (min. 50 znaków)</label>
          <textarea
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            rows={6}
            className={`${inputClass} ${errors.description ? "border-red-300 focus:ring-red-500" : ""}`}
            placeholder="Opisz co się wydarzyło, w jakich okolicznościach, co mogło się przyczynić..."
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${description.length >= 50 ? "text-green-600" : "text-gray-400"}`}>
              {description.length}/50 znaków min.
            </span>
          </div>
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>
      </div>
    </fieldset>
  );
}
