import { useState } from "react";
import type { IncidentCreate } from "../../types/incident";
import { StepEventType } from "./StepEventType";
import { StepWhenWhere } from "./StepWhenWhere";
import { StepDescription } from "./StepDescription";
import { StepConsequences } from "./StepConsequences";
import { StepPatientData } from "./StepPatientData";
import { StepSummary } from "./StepSummary";

const TOTAL_STEPS = 6;
const STEP_NAMES = [
  "Typ zdarzenia",
  "Kiedy i gdzie",
  "Co się wydarzyło",
  "Skutki i działania",
  "Dane",
  "Podsumowanie",
];

const INITIAL_DATA: Partial<IncidentCreate> = {
  event_type: undefined,
  event_date: new Date().toISOString().slice(0, 16),
  department: "",
  location: "",
  category: undefined,
  description: "",
  severity: undefined,
  immediate_actions_taken: false,
  immediate_actions_desc: "",
  preventive_suggestions: "",
  patient_age: undefined,
  patient_sex: "",
  reporter_anonymous: false,
  reporter_name: "",
  reporter_role: "",
};

interface Props {
  onSubmit: (data: IncidentCreate) => void;
}

export function IncidentForm({ onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<IncidentCreate>>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField<K extends keyof IncidentCreate>(
    field: K,
    value: IncidentCreate[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    if (step === 1 && !formData.event_type) {
      newErrors.event_type = "Wybierz typ zdarzenia";
    }
    if (step === 2) {
      if (!formData.department) newErrors.department = "Podaj oddział";
      if (!formData.event_date) newErrors.event_date = "Podaj datę";
    }
    if (step === 3) {
      if (!formData.category) newErrors.category = "Wybierz kategorię";
      if (!formData.description || formData.description.length < 50)
        newErrors.description = "Opis musi mieć min. 50 znaków";
    }
    if (step === 4 && formData.severity === undefined) {
      newErrors.severity = "Wybierz ciężkość skutku";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    onSubmit(formData as IncidentCreate);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Stepper */}
      <div className="flex items-center mb-8 overflow-x-auto">
        {STEP_NAMES.map((name, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isDone = stepNum < step;
          return (
            <div key={name} className="flex items-center">
              {i > 0 && (
                <div className={`w-8 h-0.5 mx-1 ${isDone ? "bg-blue-500" : "bg-gray-200"}`} />
              )}
              <div className="flex flex-col items-center min-w-[60px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isDone
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? "\u2713" : stepNum}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${isActive ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                  {name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Krok {step} z {TOTAL_STEPS}
      </p>

      {step === 1 && (
        <StepEventType
          value={formData.event_type}
          onChange={(v) => updateField("event_type", v)}
          error={errors.event_type}
        />
      )}
      {step === 2 && (
        <StepWhenWhere
          eventDate={formData.event_date ?? ""}
          department={formData.department ?? ""}
          location={formData.location ?? ""}
          onChangeDate={(v) => updateField("event_date", v)}
          onChangeDepartment={(v) => updateField("department", v)}
          onChangeLocation={(v) => updateField("location", v)}
          errors={errors}
        />
      )}
      {step === 3 && (
        <StepDescription
          category={formData.category}
          subcategory={formData.subcategory ?? ""}
          description={formData.description ?? ""}
          onChangeCategory={(v) => updateField("category", v)}
          onChangeSubcategory={(v) => updateField("subcategory", v)}
          onChangeDescription={(v) => updateField("description", v)}
          errors={errors}
        />
      )}
      {step === 4 && (
        <StepConsequences
          severity={formData.severity}
          actionsTaken={formData.immediate_actions_taken ?? false}
          actionsDesc={formData.immediate_actions_desc ?? ""}
          preventive={formData.preventive_suggestions ?? ""}
          onChangeSeverity={(v) => updateField("severity", v)}
          onChangeActionsTaken={(v) => updateField("immediate_actions_taken", v)}
          onChangeActionsDesc={(v) => updateField("immediate_actions_desc", v)}
          onChangePreventive={(v) => updateField("preventive_suggestions", v)}
          error={errors.severity}
        />
      )}
      {step === 5 && (
        <StepPatientData
          age={formData.patient_age}
          sex={formData.patient_sex ?? ""}
          anonymous={formData.reporter_anonymous ?? false}
          reporterName={formData.reporter_name ?? ""}
          reporterRole={formData.reporter_role ?? ""}
          onChangeAge={(v) => updateField("patient_age", v)}
          onChangeSex={(v) => updateField("patient_sex", v)}
          onChangeAnonymous={(v) => updateField("reporter_anonymous", v)}
          onChangeReporterName={(v) => updateField("reporter_name", v)}
          onChangeReporterRole={(v) => updateField("reporter_role", v)}
        />
      )}
      {step === 6 && <StepSummary data={formData} />}

      <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Wstecz
          </button>
        )}
        {step < TOTAL_STEPS && (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Dalej
          </button>
        )}
        {step === TOTAL_STEPS && (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Wyślij zgłoszenie
          </button>
        )}
      </div>
    </div>
  );
}
