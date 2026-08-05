import React, { useState } from "react";
import { FrequentMeal, MealType, ActivePage } from "../types";
import { Plus, Trash2, ArrowRight, Bookmark, Check, ArrowLeft } from "lucide-react";

interface FrequentMealsViewProps {
  frequentMeals: FrequentMeal[];
  onAddFromFrequent: (frequent: FrequentMeal, dateStr: string) => void;
  onDeleteFrequent: (id: string) => void;
  onAddCustomFrequent: (newFreq: Omit<FrequentMeal, "id">) => void;
  setActivePage: (page: ActivePage) => void;
}

export const FrequentMealsView: React.FC<FrequentMealsViewProps> = ({
  frequentMeals,
  onAddFromFrequent,
  onDeleteFrequent,
  onAddCustomFrequent,
  setActivePage,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // New frequent meal modal / inline form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newMealName, setNewMealName] = useState<string>("");
  const [newCalories, setNewCalories] = useState<number>(350);
  const [newMealType, setNewMealType] = useState<MealType>("Lunch");

  const handleQuickAdd = (item: FrequentMeal) => {
    onAddFromFrequent(item, todayStr);
    setAddedNotice(`Added "${item.mealName}" (${item.calories} kcal) to today's log.`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  const handleCreateFrequent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim()) return;

    onAddCustomFrequent({
      userId: "user_default",
      mealName: newMealName.trim(),
      calories: Math.max(0, Number(newCalories)),
      mealType: newMealType,
      isFavorite: true,
    });

    setNewMealName("");
    setNewCalories(350);
    setShowAddForm(false);
  };

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
            Quick-Log Library
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight font-sans-custom uppercase">
          My Frequent Meals
        </h1>

        <p className="text-base sm:text-lg font-bold text-black/70 leading-snug">
          Saved staple meals for 1-tap logging. No AI call or calorie calculation required.
        </p>
      </div>

      {addedNotice && (
        <div className="bg-black text-white p-4 font-extrabold text-sm uppercase tracking-wider flex items-center justify-between animate-fade-in">
          <span>{addedNotice}</span>
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* Top Action Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase text-black font-sans-custom">
          Saved Frequent List ({frequentMeals.length})
        </h2>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Frequent Meal</span>
        </button>
      </div>

      {/* Inline Create Form */}
      {showAddForm && (
        <form onSubmit={handleCreateFrequent} className="p-6 bg-neutral-50 border border-black space-y-4 animate-fade-in">
          <h3 className="text-lg font-black uppercase tracking-tight text-black border-b border-black/10 pb-2">
            Create Custom Frequent Item
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-1">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Meal Title
              </label>
              <input
                type="text"
                required
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
                placeholder="e.g., Protein Shake"
                className="w-full bg-white border border-black/20 p-2.5 text-sm font-bold text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Calories (kcal)
              </label>
              <input
                type="number"
                required
                value={newCalories}
                onChange={(e) => setNewCalories(Number(e.target.value))}
                className="w-full bg-white border border-black/20 p-2.5 text-sm font-bold text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Meal Category
              </label>
              <select
                value={newMealType}
                onChange={(e) => setNewMealType(e.target.value as MealType)}
                className="w-full bg-white border border-black/20 p-2.5 text-sm font-bold text-black focus:outline-none focus:border-black"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-black/30 text-xs font-black uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-widest"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Main List */}
      {frequentMeals.length === 0 ? (
        <div className="p-12 text-center bg-neutral-50 border border-black/10 space-y-4">
          <Bookmark className="w-8 h-8 mx-auto text-black/30" />
          <p className="text-lg font-extrabold text-black/60 uppercase tracking-tight">
            No frequent meals saved yet.
          </p>
          <p className="text-xs font-bold text-black/50 max-w-sm mx-auto">
            Create custom frequent items or tap "Save as frequent" when logging meals for 1-tap fast logging.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Frequent Meal</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-black/10 border border-black/10 bg-white">
          {frequentMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                    {meal.mealType}
                  </span>
                  <span className="text-xs font-extrabold text-black/50">Staple Item</span>
                </div>

                <h3 className="text-xl font-black text-black tracking-tight">
                  {meal.mealName}
                </h3>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <span className="text-2xl font-black text-black font-sans-custom">
                  {meal.calories}&nbsp;<span className="text-xs font-bold text-black/60">kcal</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Direct Tap Log */}
                  <button
                    onClick={() => handleQuickAdd(meal)}
                    className="px-4 py-2.5 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Today</span>
                  </button>

                  <button
                    onClick={() => onDeleteFrequent(meal.id)}
                    className="p-2.5 text-black/30 hover:text-black hover:bg-black/10 transition-colors"
                    title="Remove Frequent Meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
