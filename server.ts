import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini Client server-side
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", geminiAvailable: !!ai });
  });

  // Estimate Meal API
  app.post("/api/estimate-meal", async (req, res) => {
    try {
      const { prompt, image } = req.body;
      const cleanPrompt = (prompt || "").trim();

      if (!cleanPrompt && !image) {
        return res.status(400).json({ error: "Food description or photo is required." });
      }

      if (!ai) {
        const fallback = generateFallbackEstimate(cleanPrompt || "Meal Photo");
        return res.json(fallback);
      }

      const contents: any[] = [];

      if (image && typeof image === "string" && image.trim()) {
        const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
        let mimeType = "image/jpeg";
        let base64Data = image;

        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        } else {
          base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        }

        contents.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        });
      }

      const promptText = cleanPrompt
        ? `Analyze this meal. User description: "${cleanPrompt}". Return a concise meal title, estimated total calories, most likely meal category (Breakfast, Lunch, Snack, or Dinner), itemized calorie breakdown, and a brief portion note.`
        : `Analyze the food shown in this photo. Return a concise meal title, estimated total calories, most likely meal category (Breakfast, Lunch, Snack, or Dinner), itemized calorie breakdown, and a brief portion note.`;

      contents.push(promptText);

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction:
            "You are an accurate, expert nutritionist assistant. Analyze food images and text descriptions to estimate total caloric content realistic to actual portion sizes.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              meal_name: {
                type: Type.STRING,
                description: "Clean concise meal title identified from photo or prompt, e.g. 'Grilled Salmon with Roasted Vegetables'",
              },
              estimated_calories: {
                type: Type.INTEGER,
                description: "Estimated total calories as a whole number, e.g. 520",
              },
              meal_type: {
                type: Type.STRING,
                description: "Category: Breakfast, Lunch, Snack, or Dinner",
              },
              breakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    calories: { type: Type.INTEGER },
                  },
                  required: ["item", "calories"],
                },
              },
              confidence_note: {
                type: Type.STRING,
                description: "Brief portion estimate breakdown, e.g. '1 salmon fillet (~350 kcal), 1 cup roasted veggies (~120 kcal)'",
              },
            },
            required: ["meal_name", "estimated_calories", "meal_type"],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : "";
      if (!jsonText) {
        throw new Error("Empty response from AI model");
      }

      const parsed = JSON.parse(jsonText);
      return res.json({
        meal_name: parsed.meal_name || cleanPrompt || "Identified Meal",
        estimated_calories: Math.max(10, Math.round(Number(parsed.estimated_calories) || 350)),
        meal_type: ["Breakfast", "Lunch", "Snack", "Dinner"].includes(parsed.meal_type)
          ? parsed.meal_type
          : inferMealTypeByTime(),
        breakdown: Array.isArray(parsed.breakdown) ? parsed.breakdown : [],
        confidence_note: parsed.confidence_note || "Estimated based on photo analysis and standard portions.",
      });
    } catch (error: any) {
      console.error("Error generating meal estimate:", error);
      const fallback = generateFallbackEstimate(req.body?.prompt || "Meal Photo");
      return res.json(fallback);
    }
  });

  // Vite development middleware vs Static Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Calorie Tracker Server running on http://0.0.0.0:${PORT}`);
  });
}

function inferMealTypeByTime(): "Breakfast" | "Lunch" | "Snack" | "Dinner" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 16) return "Lunch";
  if (hour >= 16 && hour < 19) return "Snack";
  return "Dinner";
}

function generateFallbackEstimate(prompt: string) {
  const lower = prompt.toLowerCase();
  let calories = 400;
  let mealName = prompt.slice(0, 40);

  if (lower.includes("roti") || lower.includes("dal") || lower.includes("rice")) {
    calories = 520;
    mealName = "Roti, dal and rice";
  } else if (lower.includes("biryani")) {
    calories = 750;
    mealName = "Chicken Biryani";
  } else if (lower.includes("oat") || lower.includes("milk")) {
    calories = 350;
    mealName = "Oats with milk";
  } else if (lower.includes("egg") || lower.includes("toast")) {
    calories = 320;
    mealName = "Eggs and toast";
  } else if (lower.includes("coffee") || lower.includes("biscuit") || lower.includes("tea")) {
    calories = 250;
    mealName = "Coffee & Biscuits";
  } else if (lower.includes("salad") || lower.includes("apple") || lower.includes("fruit")) {
    calories = 180;
    mealName = "Fresh Salad / Fruits";
  } else if (lower.includes("pizza") || lower.includes("burger")) {
    calories = 680;
    mealName = "Fast Food Meal";
  }

  return {
    meal_name: mealName.charAt(0).toUpperCase() + mealName.slice(1),
    estimated_calories: calories,
    meal_type: inferMealTypeByTime(),
    breakdown: [
      { item: mealName, calories: calories }
    ],
    confidence_note: "Portion estimated using standard nutritional averages.",
  };
}

startServer();
