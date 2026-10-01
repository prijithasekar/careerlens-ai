import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callAI<T>(
  system: string,
  userContent: string,
  schema: z.ZodType<T>
): Promise<T> {
  const res = await client.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 4000,
    system,
    messages: [{ role: "user", content: userContent }],
  });

  const block = res.content.find((b) => b.type === "text");
  const raw = block && block.type === "text" ? block.text : "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  return schema.parse(JSON.parse(cleaned));
}