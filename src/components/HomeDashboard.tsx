import React from "react";
import { UserGoal, MealLog, FrequentMeal, ActivePage } from "../types";
import { Plus, Trash2, ArrowRight, Bookmark, Scale, Target, RefreshCw, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const diff = data.calories - data.target;
    return (
      <div className="bg-black text-white p-3 text-xs font-sans-custom select-none border border-white/20 shadow-xl">
        <p className="font-black uppercase tracking-wider text-neutral-400 mb-1">
          {data.fullDate} ({data.dayLabel})
        </p>
        <p className="text-sm font-black">
          Intake: <span className="text-white">{data.calories.toLocaleString()} kcal</span>
        </p>
        <p className="text-xs font-bold text-neutral-300">
          Daily Goal: {data.target.toLocaleString()} kcal
        </p>
        <p
          className={`text-[11px] font-black uppercase mt-1 ${
            diff > 0 ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {diff > 0
            ? `+${diff} kcal over target`
            : diff === 0
            ? "Exact goal matched"
            : `${Math.abs(diff)} kcal remaining`}
        </p>
      </div>
    );
  }
  return null;
};

interface HomeDashboardProps {
  userGoal: UserGoal;
  meals: MealLog[];
  frequentMeals: FrequentMeal[];
  onAddMealFromFrequent: (frequent: FrequentMeal, dateStr: string) => void;
  onDeleteMeal: (mealId: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userGoal,
  meals,
  frequentMeals,
  onAddMealFromFrequent,
  onDeleteMeal,
  setActivePage,
}) => {
  // Filter meals for today
  const todayStr = new Date().toISOString().split("T")[0];
  const todayMeals = meals.filter((m) => m.date === todayStr);

  const totalCaloriesToday = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const targetCalories = userGoal.dailyCalorieTarget || 1700;
  const caloriesRemaining = Math.max(0, targetCalories - totalCaloriesToday);
  const progressPercent = Math.min(100, Math.round((totalCaloriesToday / targetCalories) * 100));

  // Generate last 7 days metrics for Recharts bar chart
  const last7DaysData = Array.from({ length: 7 }).map((_, idx) => {
    const daysAgo = 6 - idx;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const dayMeals = meals.filter((m) => m.date === dateStr);
    const totalCal = dayMeals.reduce((sum, m) => sum + m.calories, 0);

    const dayLabel = daysAgo === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
    const fullDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return {
      date: dateStr,
      dayLabel,
      fullDate,
      calories: totalCal,
      target: targetCalories,
    };
  });

  const avg7DayCalories = Math.round(
    last7DaysData.reduce((acc, d) => acc + d.calories, 0) / 7
  );
  const daysOnTargetCount = last7DaysData.filter(
    (d) => d.calories > 0 && d.calories <= targetCalories
  ).length;

  // Meal types grouping
  const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner"] as const;

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12 space-y-16 animate-fade-in select-none">
      {/* Editorial Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
              Daily Overview
            </span>
            <span className="text-xs font-bold text-black/50 uppercase tracking-widest">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight font-sans-custom uppercase">
            Home Dashboard
          </h1>

          <p className="text-base font-bold text-black/70">
            Design is an act of translation. Track your daily caloric intake and nutritional volume with zero fluff.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => setActivePage("add-meal")}
          className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Meal</span>
        </button>
      </div>

      {/* SECTION 1: CALORIES TODAY METRIC CARD (Exact user prompt format) */}
      <section className="bg-neutral-50 border border-black p-8 md:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-black/50 block">
              Nutritional Volume
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-sans-custom">
              Calories Today
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-4xl sm:text-5xl font-black font-sans-custom text-black">
              {totalCaloriesToday.toLocaleString()}&nbsp;/&nbsp;{targetCalories.toLocaleString()}
              <span className="text-base font-extrabold text-black/60 ml-2">kcal</span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-black/60 mt-1">
              {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : "Target Achieved"}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar (Exact high-contrast ASCII + Bar) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
            <span>Progress • {progressPercent}%</span>
            <span>Target • {targetCalories} kcal</span>
          </div>

          {/* High Contrast Bar */}
          <div className="w-full h-6 bg-white border border-black p-0.5 relative overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* ASCII visual block representation */}
          <div className="font-mono text-xs font-extrabold tracking-widest text-black/80 overflow-x-auto whitespace-nowrap">
            {Array.from({ length: 20 }).map((_, i) => {
              const filledBlocks = Math.round((progressPercent / 100) * 20);
              return i < filledBlocks ? "█" : "░";
            }).join("")}
            <span className="ml-3 font-sans text-[11px] font-bold text-black/60">
              ({totalCaloriesToday} of {targetCalories} kcal)
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-black/10 text-xs font-bold">
          <div>
            <span className="text-black/50 uppercase block text-[10px]">Meals Logged</span>
            <span className="text-lg font-black text-black">{todayMeals.length} items</span>
          </div>
          <div>
            <span className="text-black/50 uppercase block text-[10px]">Current Weight</span>
            <span className="text-lg font-black text-black">{userGoal.currentWeight} {userGoal.unit}</span>
          </div>
          <div>
            <span className="text-black/50 uppercase block text-[10px]">Target Weight</span>
            <span className="text-lg font-black text-black">{userGoal.targetWeight} {userGoal.unit}</span>
          </div>
          <div>
            <span className="text-black/50 uppercase block text-[10px]">Weight Remaining</span>
            <span className="text-lg font-black text-black">
              {Math.max(0, Number((userGoal.currentWeight - userGoal.targetWeight).toFixed(1)))} {userGoal.unit}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: 7-DAY CALORIC PROGRESS BAR CHART (RECHARTS) */}
      <section className="bg-neutral-50 border border-black p-8 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                Recharts Analytics
              </span>
              <span className="text-xs font-bold text-black/50 uppercase tracking-widest">
                Past 7 Days
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans-custom mt-1">
              7-Day Calorie Progress
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-black inline-block" />
              <span>Target Met</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-600 inline-block" />
              <span>Exceeded Goal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-b-2 border-dashed border-black inline-block" />
              <span>Goal ({targetCalories} kcal)</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="w-full h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 11, fontWeight: 800, fill: "#000000" }}
                axisLine={{ stroke: "#000000", strokeWidth: 1.5 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 700, fill: "#444444" }}
                axisLine={{ stroke: "#000000", strokeWidth: 1.5 }}
                tickLine={false}
                domain={[0, (dataMax: number) => Math.max(dataMax + 200, targetCalories + 300)]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <ReferenceLine
                y={targetCalories}
                stroke="#000000"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Bar dataKey="calories" radius={[2, 2, 0, 0]} maxBarSize={44}>
                {last7DaysData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.calories > targetCalories ? "#dc2626" : "#000000"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Stats Summary Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/10 text-xs font-bold">
          <div>
            <span className="text-black/50 uppercase block text-[10px]">7-Day Average Intake</span>
            <span className="text-lg font-black text-black">{avg7DayCalories.toLocaleString()} kcal / day</span>
          </div>

          <div>
            <span className="text-black/50 uppercase block text-[10px]">Target Adherence</span>
            <span className="text-lg font-black text-black">
              {daysOnTargetCount} of 7 days within target
            </span>
          </div>

          <div>
            <span className="text-black/50 uppercase block text-[10px]">Highest Day Intake</span>
            <span className="text-lg font-black text-black">
              {Math.max(...last7DaysData.map((d) => d.calories)).toLocaleString()} kcal
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: TODAY'S MEALS LIST */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-black font-sans-custom">
            Today's Meals
          </h2>
          <span className="text-xs font-extrabold uppercase text-black/50">
            {todayMeals.length} Entries
          </span>
        </div>

        {todayMeals.length === 0 ? (
          <div className="p-12 text-center bg-neutral-50 border border-black/10 space-y-4">
            <p className="text-lg font-extrabold text-black/60 uppercase tracking-tight">
              No meals logged for today yet.
            </p>
            <button
              onClick={() => setActivePage("add-meal")}
              className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Meal</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black/10 border border-black/10 bg-white">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                      {meal.mealType}
                    </span>
                    {meal.time && (
                      <span className="text-xs font-bold text-black/50">{meal.time}</span>
                    )}
                    {meal.isAiEstimated && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-black/70 border border-black/20 px-1.5 py-0.5">
                        Gemini Estimated
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-black tracking-tight">
                    {meal.mealName}
                  </h3>

                  {meal.confidenceNote && (
                    <p className="text-xs font-medium text-black/60 italic">
                      {meal.confidenceNote}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="text-xl font-black text-black font-sans-custom">
                    {meal.calories}&nbsp;<span className="text-xs font-bold text-black/60">kcal</span>
                  </span>

                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-2 text-black/40 hover:text-black hover:bg-black/10 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: QUICK ADD FROM FREQUENT MEALS (Direct 1-tap add) */}
      <section className="space-y-6 pt-6 border-t border-black/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black uppercase text-black font-sans-custom">
              Quick Add From Frequent Meals
            </h3>
            <p className="text-xs font-bold text-black/60">
              Tap a saved item to immediately add it to today's log without calling Gemini.
            </p>
          </div>

          <button
            onClick={() => setActivePage("frequent")}
            className="text-xs font-extrabold uppercase text-black hover:underline underline-offset-4 flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {frequentMeals.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onAddMealFromFrequent(item, todayStr)}
              className="p-4 bg-neutral-50 hover:bg-black hover:text-white border border-black/20 transition-all text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white group-hover:bg-white group-hover:text-black px-1.5 py-0.5">
                  {item.mealType}
                </span>
                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold tracking-tight truncate">
                  {item.mealName}
                </h4>
                <p className="text-xs font-bold text-black/60 group-hover:text-white/80">
                  {item.calories} kcal
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
