import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IncidentForm } from "../components/IncidentForm";
import { createIncident } from "../api/incidents";
import type { IncidentCreate } from "../types/incident";

export function ReportPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: number } | null>(null);

  async function handleSubmit(data: IncidentCreate) {
    setSubmitting(true);
    setError(null);
    try {
      const incident = await createIncident(data);
      setSuccess({ id: incident.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd wysyłania zgłoszenia");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-green-600">{"\u2713"}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zgłoszenie przyjęte</h1>
          <p className="text-gray-600 mb-1">Numer zgłoszenia:</p>
          <p className="text-2xl font-mono font-bold text-blue-600 mb-6">
            ZN-{String(success.id).padStart(4, "0")}
          </p>
          <p className="text-sm text-gray-500 mb-6">Koordynator ds. jakości zostanie powiadomiony.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate(`/incidents/${success.id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Zobacz zgłoszenie
            </button>
            <button onClick={() => navigate("/")} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Dashboard
            </button>
            <button onClick={() => { setSuccess(null); setError(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Zgłoś kolejne
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Zgłoś zdarzenie niepożądane</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}
      {submitting && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">Wysyłanie...</div>
      )}
      <IncidentForm onSubmit={handleSubmit} />
    </div>
  );
}
