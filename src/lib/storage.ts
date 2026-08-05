import { UserGoal, MealLog, FrequentMeal, WeightLog } from "../types";

export const STORAGE_KEYS = {
  USER_GOAL: "biteopia_user_goal_v3",
  MEALS: "biteopia_meals_v3",
  FREQUENT_MEALS: "biteopia_frequent_meals_v3",
  WEIGHT_LOGS: "biteopia_weight_logs_v3",
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDateMinusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const INITIAL_GOALS: UserGoal = {
  userId: "user_default",
  name: "",
  email: "",
  startingWeight: 0,
  currentWeight: 0,
  targetWeight: 0,
  dailyCalorieTarget: 2000,
  unit: "kg",
  onboarded: false,
};

export const INITIAL_MEALS: MealLog[] = [];

export const INITIAL_FREQUENT_MEALS: FrequentMeal[] = [];

export const INITIAL_WEIGHT_LOGS: WeightLog[] = [];

export function loadUserGoals(): UserGoal {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_GOAL);
    if (!raw) return INITIAL_GOALS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_GOALS;
  }
}

export function saveUserGoals(goals: UserGoal): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_GOAL, JSON.stringify(goals));
  } catch (e) {
    console.error("Failed to save goals", e);
  }
}

export function loadMeals(): MealLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEALS);
    if (!raw) return INITIAL_MEALS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MEALS;
  }
}

export function saveMeals(meals: MealLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  } catch (e) {
    console.error("Failed to save meals", e);
  }
}

export function loadFrequentMeals(): FrequentMeal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FREQUENT_MEALS);
    if (!raw) return INITIAL_FREQUENT_MEALS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FREQUENT_MEALS;
  }
}

export function saveFrequentMeals(frequent: FrequentMeal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FREQUENT_MEALS, JSON.stringify(frequent));
  } catch (e) {
    console.error("Failed to save frequent meals", e);
  }
}

export function loadWeightLogs(): WeightLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHT_LOGS);
    if (!raw) return INITIAL_WEIGHT_LOGS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_WEIGHT_LOGS;
  }
}

export function saveWeightLogs(logs: WeightLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save weight logs", e);
  }
}

export function resetAllDataToDefault(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_GOAL);
  localStorage.removeItem(STORAGE_KEYS.MEALS);
  localStorage.removeItem(STORAGE_KEYS.FREQUENT_MEALS);
  localStorage.removeItem(STORAGE_KEYS.WEIGHT_LOGS);
}
