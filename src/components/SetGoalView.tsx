import React, { useState } from "react";
import { UserGoal, ActivePage } from "../types";
import { ArrowRight, Check, Target, RotateCcw } from "lucide-react";

interface SetGoalViewProps {
  userGoal: UserGoal;
  onSaveGoal: (updatedGoal: UserGoal) => void;
  onResetData: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const SetGoalView: React.FC<SetGoalViewProps> = ({
  userGoal,
  onSaveGoal,
  onResetData,
  setActivePage,
}) => {
  const [currentWeight, setCurrentWeight] = useState<number | "">(userGoal.currentWeight || "");
  const [targetWeight, setTargetWeight] = useState<number | "">(userGoal.targetWeight || "");
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<number | "">(userGoal.dailyCalorieTarget || 2000);
  const [unit, setUnit] = useState<"kg" | "lbs">(userGoal.unit || "kg");
  const [name, setName] = useState<string>(userGoal.name || "");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cWeight = Number(currentWeight) || 70;
    const tWeight = Number(targetWeight) || cWeight;
    const sWeight = userGoal.startingWeight || cWeight;

    onSaveGoal({
      ...userGoal,
      name: name.trim() || "My Profile",
      email: "",
      startingWeight: sWeight,
      currentWeight: cWeight,
      targetWeight: tWeight,
      dailyCalorieTarget: Number(dailyCalorieTarget) || 2000,
      unit,
      onboarded: true,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActivePage("home");
    }, 1200);
  };

  return (
    <div className="px-6 md:px-12 max-w-4xl mx-auto py-12 space-y-12 animate-fade-in select-none">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
            Step 1 • Target Calibration
          </span>
          <span className="text-xs font-bold text-black/50 uppercase tracking-wider">
            No Fluff, Just Impact
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight font-sans-custom uppercase">
          Set Calorie &amp; Weight Goals
        </h1>

        <p className="text-base sm:text-lg font-bold text-black/70 leading-snug">
          Define your daily target intake and body weight objectives. You can adjust your target manually at any time.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-black text-white p-4 font-extrabold text-sm uppercase tracking-wider flex items-center justify-between">
          <span>Goal calibration saved successfully. Redirecting to dashboard...</span>
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="p-8 bg-neutral-50 border border-black/10 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight text-black border-b border-black/10 pb-4">
              Profile Identification
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                User Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-black/20 p-3 text-sm font-extrabold text-black focus:outline-none focus:border-black"
                placeholder="e.g. Alex"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Measurement Unit
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUnit("kg")}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest border ${
                    unit === "kg" ? "bg-black text-white border-black" : "bg-white text-black border-black/20"
                  }`}
                >
                  Kilograms (kg)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("lbs")}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest border ${
                    unit === "lbs" ? "bg-black text-white border-black" : "bg-white text-black border-black/20"
                  }`}
                >
                  Pounds (lbs)
                </button>
              </div>
            </div>
          </div>

          {/* Targets */}
          <div className="p-8 bg-neutral-50 border border-black/10 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight text-black border-b border-black/10 pb-4">
              Quantitative Metrics
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Current Weight ({unit})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  min="10"
                  max="400"
                  placeholder="e.g. 75"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-white border border-black/20 p-3 text-lg font-black text-black focus:outline-none focus:border-black"
                />
                <span className="text-sm font-black text-black uppercase">{unit}</span>
              </div>
              <p className="text-[11px] font-bold text-black/50">Your starting body weight</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Target Weight ({unit})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  min="10"
                  max="400"
                  placeholder="e.g. 70"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-white border border-black/20 p-3 text-lg font-black text-black focus:outline-none focus:border-black"
                />
                <span className="text-sm font-black text-black uppercase">{unit}</span>
              </div>
              <p className="text-[11px] font-bold text-black/50">Your target goal weight</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Daily Calorie Target (kcal)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="10"
                  required
                  min="500"
                  max="8000"
                  placeholder="e.g. 2000"
                  value={dailyCalorieTarget}
                  onChange={(e) => setDailyCalorieTarget(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-white border border-black/20 p-3 text-lg font-black text-black focus:outline-none focus:border-black"
                />
                <span className="text-sm font-black text-black uppercase">kcal</span>
              </div>
              <p className="text-[11px] font-bold text-black/50">Daily calorie limit recommendation</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/10">
          <button
            type="button"
            onClick={onResetData}
            className="flex items-center gap-2 text-xs font-extrabold uppercase text-black/60 hover:text-black transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset &amp; Clear Data</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-5 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
          >
            <span>Save Profile &amp; Goals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
