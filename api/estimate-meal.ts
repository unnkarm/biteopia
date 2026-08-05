import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const body = req.body ?? {};
    const meal = typeof body.meal === "string" ? body.meal : typeof body.prompt === "string" ? body.prompt : "";

    if (!meal.trim()) {
      return res.status(400).json({
        error: "Meal description is required",
      });
    }

    if (!ai) {
      return res.status(200).json({
        calories: 420,
        protein: 18,
        carbs: 52,
        fat: 15,
        fallback: true,
      });
    }

    const prompt = `
Estimate the nutritional information for:

"${meal}"

Return ONLY valid JSON in this exact format:

{
  "calories": 500,
  "protein": 20,
  "carbs": 60,
  "fat": 15
}

Do not use markdown or code fences.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.text ?? "";

    if (!text) {
      return res.status(500).json({
        error: "No meal estimate returned by Gemini",
      });
    }

    // Remove markdown fences if Gemini adds them
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!cleanText) {
      return res.status(500).json({
        error: "Empty meal estimate returned by Gemini",
      });
    }

    try {
      return res.status(200).json(JSON.parse(cleanText));
    } catch {
      return res.status(500).json({
        error: "Invalid JSON returned by Gemini",
      });
    }
  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      error: "Failed to estimate meal",
    });
  }
}