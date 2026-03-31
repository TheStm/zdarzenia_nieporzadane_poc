interface Props {
  data: { year: number; month: number; count: number }[];
}

const MONTH_NAMES = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];

export function MonthlyChart({ data }: Props) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Trend miesięczny</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((d) => (
          <div key={`${d.year}-${d.month}`} className="flex-1 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{d.count}</span>
            <div
              className="w-full bg-blue-500 rounded-t transition-all min-h-[4px]"
              style={{ height: `${(d.count / max) * 100}%` }}
            />
            <span className="text-xs text-gray-400 mt-1">{MONTH_NAMES[d.month - 1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
