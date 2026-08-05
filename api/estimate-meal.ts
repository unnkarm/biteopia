import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

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
    const { meal } = req.body;

    if (!meal) {
      return res.status(400).json({
        error: "Meal description is required",
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