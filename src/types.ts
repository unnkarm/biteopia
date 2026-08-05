export type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner";

export interface MealLog {
  id: string;
  userId: string;
  mealName: string;
  calories: number;
  mealType: MealType;
  date: string; // YYYY-MM-DD
  time?: string;
  isAiEstimated?: boolean;
  breakdown?: { item: string; calories: number }[];
  confidenceNote?: string;
}

export interface FrequentMeal {
  id: string;
  userId: string;
  mealName: string;
  calories: number;
  mealType: MealType;
  isFavorite?: boolean;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  date: string; // YYYY-MM-DD
  note?: string;
}

export interface UserGoal {
  userId: string;
  name: string;
  email: string;
  startingWeight: number;
  currentWeight: number;
  targetWeight: number;
  dailyCalorieTarget: number;
  unit: "kg" | "lbs";
  onboarded: boolean;
}

export interface MealEstimate {
  meal_name: string;
  estimated_calories: number;
  meal_type: MealType;
  breakdown?: { item: string; calories: number }[];
  confidence_note?: string;
}

export type ActivePage = "home" | "add-meal" | "frequent" | "weight" | "goal" | "profile" | "works" | "capabilities";

export interface ProjectWork {
  id: string;
  title: string;
  subtitle?: string;
  category: "Magazine Design & Merchandise" | "Brand Identity" | "Packaging & Spatial" | "Editorial Systems" | "Digital Visual Language";
  image: string;
  year: string;
  client: string;
  description: string;
  tags: string[];
  aspectRatio?: "square" | "portrait" | "landscape";
  featured?: boolean;
}

export interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  services: string[];
  featuredProject?: string;
}

export interface InquiryForm {
  name: string;
  email: string;
  company: string;
  servicesNeeded: string[];
  budget: string;
  message: string;
}
