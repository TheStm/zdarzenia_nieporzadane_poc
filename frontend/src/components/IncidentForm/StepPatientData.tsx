interface Props {
  age: number | undefined;
  sex: string;
  anonymous: boolean;
  reporterName: string;
  reporterRole: string;
  onChangeAge: (v: number | undefined) => void;
  onChangeSex: (v: string) => void;
  onChangeAnonymous: (v: boolean) => void;
  onChangeReporterName: (v: string) => void;
  onChangeReporterRole: (v: string) => void;
}

const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export function StepPatientData({ age, sex, anonymous, reporterName, reporterRole, onChangeAge, onChangeSex, onChangeAnonymous, onChangeReporterName, onChangeReporterRole }: Props) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-gray-900 mb-4">Dane pacjenta i zgłaszającego</legend>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Dane pacjenta (opcjonalne)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Wiek pacjenta</label>
            <input type="number" min={0} max={150} value={age ?? ""} onChange={(e) => onChangeAge(e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Płeć</label>
            <select value={sex} onChange={(e) => onChangeSex(e.target.value)} className={inputClass}>
              <option value="">— nie podano —</option>
              <option value="K">Kobieta</option>
              <option value="M">Mężczyzna</option>
              <option value="Inne">Inne</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-zdarzenia-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Dane zgłaszającego</h3>

        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input type="checkbox" checked={anonymous} onChange={(e) => onChangeAnonymous(e.target.checked)} className="rounded" />
          <span className="text-sm font-medium text-gray-700">Zgłoszenie anonimowe</span>
        </label>

        {!anonymous && (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Imię i nazwisko</label>
              <input type="text" value={reporterName} onChange={(e) => onChangeReporterName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Rola / stanowisko</label>
              <select value={reporterRole} onChange={(e) => onChangeReporterRole(e.target.value)} className={inputClass}>
                <option value="">— wybierz —</option>
                <option value="Lekarz">Lekarz</option>
                <option value="Pielęgniarka">Pielęgniarka</option>
                <option value="Położna">Położna</option>
                <option value="Ratownik medyczny">Ratownik medyczny</option>
                <option value="Farmaceuta">Farmaceuta</option>
                <option value="Technik">Technik</option>
                <option value="Administracja">Administracja</option>
                <option value="Inny">Inny</option>
              </select>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Dane zgłaszającego są chronione i nie mogą być wykorzystane w postępowaniu dyscyplinarnym ani karnym (art. 21-23 ustawy o jakości).
        </p>
      </div>
    </fieldset>
  );
}
