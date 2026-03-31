interface Props {
  eventDate: string;
  department: string;
  location: string;
  onChangeDate: (v: string) => void;
  onChangeDepartment: (v: string) => void;
  onChangeLocation: (v: string) => void;
  errors: Record<string, string>;
}

const DEPARTMENTS = [
  "Oddział Chirurgii", "Oddział Wewnętrzny", "SOR",
  "Oddział Ginekologiczno-Położniczy", "Oddział Pediatryczny",
  "Oddział Ortopedyczny", "Oddział Neurologiczny", "Oddział Kardiologiczny",
  "Oddział Anestezjologii i IT", "Blok Operacyjny", "Izba Przyjęć",
  "Apteka Szpitalna", "Inne",
];

const LOCATIONS = [
  "Sala chorych", "Korytarz", "Łazienka", "Gabinet zabiegowy",
  "Blok operacyjny", "SOR", "Inne",
];

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const errorClass = "text-red-600 text-sm mt-1";

export function StepWhenWhere({ eventDate, department, location, onChangeDate, onChangeDepartment, onChangeLocation, errors }: Props) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-gray-900 mb-4">Kiedy i gdzie</legend>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Data i godzina zdarzenia</label>
          <input type="datetime-local" value={eventDate} onChange={(e) => onChangeDate(e.target.value)} className={inputClass} />
          {errors.event_date && <p className={errorClass}>{errors.event_date}</p>}
        </div>
        <div>
          <label className={labelClass}>Oddział</label>
          <select value={department} onChange={(e) => onChangeDepartment(e.target.value)} className={inputClass}>
            <option value="">— wybierz oddział —</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.department && <p className={errorClass}>{errors.department}</p>}
        </div>
        <div>
          <label className={labelClass}>Lokalizacja (opcjonalnie)</label>
          <select value={location} onChange={(e) => onChangeLocation(e.target.value)} className={inputClass}>
            <option value="">— wybierz —</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
