import React, { useState } from "react";
import { UserGoal, WeightLog, ActivePage } from "../types";
import { Scale, Plus, Trash2, ArrowRight, Check, Target, TrendingDown, ArrowLeft } from "lucide-react";

interface WeightTrackerViewProps {
  userGoal: UserGoal;
  weightLogs: WeightLog[];
  onLogWeight: (weight: number, date: string, note?: string) => void;
  onDeleteWeightLog: (id: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const WeightTrackerView: React.FC<WeightTrackerViewProps> = ({
  userGoal,
  weightLogs,
  onLogWeight,
  onDeleteWeightLog,
  setActivePage,
}) => {
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [inputWeight, setInputWeight] = useState<number>(userGoal.currentWeight);
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [inputNote, setInputNote] = useState<string>("");
  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  const unit = userGoal.unit || "kg";
  const startingWeight = userGoal.startingWeight || 77;
  const currentWeight = userGoal.currentWeight || 75.8;
  const targetWeight = userGoal.targetWeight || 70;
  const remainingWeight = Math.max(0, Number((currentWeight - targetWeight).toFixed(1)));
  const totalDifference = Math.abs(Number((startingWeight - currentWeight).toFixed(1)));

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWeight) return;

    onLogWeight(Number(inputWeight), inputDate, inputNote.trim() || undefined);
    setSuccessNotice(true);
    setShowLogModal(false);
    setInputNote("");
    setTimeout(() => setSuccessNotice(false), 2500);
  };

  // Sort weight logs newest first
  const sortedLogs = [...weightLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="px-6 md:px-12 max-w-5xl mx-auto py-12 space-y-12 animate-fade-in select-none">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePage("home")}
            className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1 hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
            Progress Tracking
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight font-sans-custom uppercase">
          Weight Progress
        </h1>

        <p className="text-base sm:text-lg font-bold text-black/70 leading-snug">
          Monitor body composition changes over time. Consistency over perfection.
        </p>
      </div>

      {successNotice && (
        <div className="bg-black text-white p-4 font-extrabold text-sm uppercase tracking-wider flex items-center justify-between animate-fade-in">
          <span>Weight measurement recorded and current weight updated.</span>
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* SECTION 1: METRICS DISPLAY BANNER (Matching prompt format exactly) */}
      <section className="bg-neutral-50 border border-black p-8 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-black/50 block">
                Starting Weight
              </span>
              <span className="text-3xl font-black text-black font-sans-custom">
                {startingWeight}&nbsp;<span className="text-xs font-extrabold text-black/60">{unit}</span>
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-black/50 block">
                Current Weight
              </span>
              <span className="text-3xl font-black text-black font-sans-custom">
                {currentWeight}&nbsp;<span className="text-xs font-extrabold text-black/60">{unit}</span>
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-black/50 block">
                Target Weight
              </span>
              <span className="text-3xl font-black text-black font-sans-custom">
                {targetWeight}&nbsp;<span className="text-xs font-extrabold text-black/60">{unit}</span>
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-black/50 block">
                Remaining
              </span>
              <span className="text-3xl font-black text-black font-sans-custom">
                {remainingWeight}&nbsp;<span className="text-xs font-extrabold text-black/60">{unit}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-4 border-t border-black/10 flex items-center justify-between">
          <div className="text-xs font-extrabold uppercase text-black/70 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-black" />
            <span>Total Lost: {totalDifference} {unit} since start</span>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="px-8 py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Weight</span>
          </button>
        </div>
      </section>

      {/* SECTION 2: WEIGHT LOG MODAL / INLINE FORM */}
      {showLogModal && (
        <form onSubmit={handleSaveLog} className="p-8 bg-neutral-50 border border-black space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <h3 className="text-2xl font-black uppercase text-black font-sans-custom">
              Record Measurement
            </h3>
            <button
              type="button"
              onClick={() => setShowLogModal(false)}
              className="text-xs font-black uppercase text-black hover:underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Weight ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={inputWeight}
                onChange={(e) => setInputWeight(Number(e.target.value))}
                className="w-full bg-white border border-black/20 p-3 text-lg font-black text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Date
              </label>
              <input
                type="date"
                required
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full bg-white border border-black/20 p-3 text-sm font-bold text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Morning weigh-in after workout"
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
                className="w-full bg-white border border-black/20 p-3 text-sm font-bold text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Save Weigh-in
            </button>
          </div>
        </form>
      )}

      {/* SECTION 3: LOG HISTORY LIST */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black uppercase text-black font-sans-custom border-b border-black/10 pb-4">
          Measurement History
        </h2>

        {sortedLogs.length === 0 ? (
          <div className="p-12 text-center bg-neutral-50 border border-black/10 space-y-4">
            <Scale className="w-8 h-8 mx-auto text-black/30" />
            <p className="text-lg font-extrabold text-black/60 uppercase tracking-tight">
              No weight logs recorded yet.
            </p>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Record First Weigh-in</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black/10 border border-black/10 bg-white">
            {sortedLogs.map((log) => (
              <div
                key={log.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest text-black/50">
                    {log.date}
                  </span>
                  {log.note && (
                    <p className="text-xs font-bold text-black/70 italic">{log.note}</p>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-2xl font-black text-black font-sans-custom">
                    {log.weight}&nbsp;<span className="text-xs font-bold text-black/60">{unit}</span>
                  </span>

                  <button
                    onClick={() => onDeleteWeightLog(log.id)}
                    className="p-2 text-black/30 hover:text-black hover:bg-black/10 transition-colors"
                    title="Delete Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
