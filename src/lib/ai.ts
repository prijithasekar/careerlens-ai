import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callAI<T>(
  system: string,
  userContent: string,
  schema: z.ZodType<T>
): Promise<T> {
  let lastError: unknown;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: userContent,
          config: {
            systemInstruction: system,
            responseMimeType: "application/json",
            maxOutputTokens: 8192,
          },
        });

        const raw = res.text ?? "";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        return schema.parse(JSON.parse(cleaned));
      } catch (err) {
        lastError = err;
        const status = (err as { status?: number }).status;

        if (status === 503 || status === 429) {
          await sleep(2000 * (attempt + 1)); // busy: wait, then retry
          continue;
        }
        if (status === 404) break; // model not available: try next model
        throw err;
      }
    }
  }

  throw lastError;
}