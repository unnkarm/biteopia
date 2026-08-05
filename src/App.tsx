import React, { useState, useEffect } from "react";
import { ActivePage, UserGoal, MealLog, FrequentMeal, WeightLog } from "./types";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomeDashboard } from "./components/HomeDashboard";
import { AddMealView } from "./components/AddMealView";
import { FrequentMealsView } from "./components/FrequentMealsView";
import { WeightTrackerView } from "./components/WeightTrackerView";
import { SetGoalView } from "./components/SetGoalView";

import {
  loadUserGoals,
  saveUserGoals,
  loadMeals,
  saveMeals,
  loadFrequentMeals,
  saveFrequentMeals,
  loadWeightLogs,
  saveWeightLogs,
  resetAllDataToDefault,
} from "./lib/storage";

export default function App() {
  const [userGoal, setUserGoal] = useState<UserGoal>(() => loadUserGoals());
  const [activePage, setActivePage] = useState<ActivePage>(() =>
    loadUserGoals().onboarded ? "home" : "goal"
  );

  // Core Calorie Tracker Application State
  const [meals, setMeals] = useState<MealLog[]>(() => loadMeals());
  const [frequentMeals, setFrequentMeals] = useState<FrequentMeal[]>(() => loadFrequentMeals());
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => loadWeightLogs());

  // Save changes to Local Storage
  useEffect(() => {
    saveUserGoals(userGoal);
  }, [userGoal]);

  useEffect(() => {
    saveMeals(meals);
  }, [meals]);

  useEffect(() => {
    saveFrequentMeals(frequentMeals);
  }, [frequentMeals]);

  useEffect(() => {
    saveWeightLogs(weightLogs);
  }, [weightLogs]);

  // Handlers for state updates
  const handleSaveGoal = (updatedGoal: UserGoal) => {
    setUserGoal(updatedGoal);

    // If no weight logs exist yet and weight is entered, log starting weight automatically
    if (weightLogs.length === 0 && updatedGoal.currentWeight > 0) {
      const todayStr = new Date().toISOString().split("T")[0];
      const initialLog: WeightLog = {
        id: "w_" + Date.now(),
        userId: updatedGoal.userId || "user_default",
        weight: updatedGoal.currentWeight,
        date: todayStr,
        note: "Initial weight baseline",
      };
      setWeightLogs([initialLog]);
    }
  };

  const handleAddMeal = (newMeal: Omit<MealLog, "id">) => {
    const created: MealLog = {
      ...newMeal,
      id: "m_" + Date.now(),
    };
    setMeals((prev) => [created, ...prev]);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleAddMealFromFrequent = (frequent: FrequentMeal, dateStr: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const created: MealLog = {
      id: "m_" + Date.now(),
      userId: frequent.userId,
      mealName: frequent.mealName,
      calories: frequent.calories,
      mealType: frequent.mealType,
      date: dateStr,
      time: timeStr,
      isAiEstimated: false,
      confidenceNote: "Added from Frequent Meals list",
    };
    setMeals((prev) => [created, ...prev]);
  };

  const handleSaveFrequentMeal = (newFreq: Omit<FrequentMeal, "id">) => {
    // Check if already exists to prevent duplicate
    const exists = frequentMeals.some(
      (fm) => fm.mealName.toLowerCase() === newFreq.mealName.toLowerCase()
    );
    if (!exists) {
      const created: FrequentMeal = {
        ...newFreq,
        id: "fm_" + Date.now(),
      };
      setFrequentMeals((prev) => [created, ...prev]);
    }
  };

  const handleDeleteFrequent = (id: string) => {
    setFrequentMeals((prev) => prev.filter((fm) => fm.id !== id));
  };

  const handleLogWeight = (weight: number, date: string, note?: string) => {
    const created: WeightLog = {
      id: "w_" + Date.now(),
      userId: "user_default",
      weight,
      date,
      note,
    };
    setWeightLogs((prev) => [created, ...prev]);
    setUserGoal((prev) => ({
      ...prev,
      currentWeight: weight,
    }));
  };

  const handleDeleteWeightLog = (id: string) => {
    setWeightLogs((prev) => prev.filter((w) => w.id !== id));
  };

  const handleResetData = () => {
    resetAllDataToDefault();
    setUserGoal(loadUserGoals());
    setMeals(loadMeals());
    setFrequentMeals(loadFrequentMeals());
    setWeightLogs(loadWeightLogs());
    setActivePage("goal");
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans-custom selection:bg-black selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <div>
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          userName={userGoal.name || "Profile"}
        />

        {/* Main Application Views */}
        <main className="w-full">
          {activePage === "home" && (
            <HomeDashboard
              userGoal={userGoal}
              meals={meals}
              frequentMeals={frequentMeals}
              onAddMealFromFrequent={handleAddMealFromFrequent}
              onDeleteMeal={handleDeleteMeal}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "add-meal" && (
            <AddMealView
              onSaveMeal={handleAddMeal}
              onSaveFrequentMeal={handleSaveFrequentMeal}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "frequent" && (
            <FrequentMealsView
              frequentMeals={frequentMeals}
              onAddFromFrequent={handleAddMealFromFrequent}
              onDeleteFrequent={handleDeleteFrequent}
              onAddCustomFrequent={handleSaveFrequentMeal}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "weight" && (
            <WeightTrackerView
              userGoal={userGoal}
              weightLogs={weightLogs}
              onLogWeight={handleLogWeight}
              onDeleteWeightLog={handleDeleteWeightLog}
              setActivePage={setActivePage}
            />
          )}

          {(activePage === "goal" || activePage === "profile") && (
            <SetGoalView
              userGoal={userGoal}
              onSaveGoal={handleSaveGoal}
              onResetData={handleResetData}
              setActivePage={setActivePage}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
};
