//import { OPENAI_API_KEY } from "$env/static/private";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "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" });

/* For the level parameter:
  0 indicates brief summary (2 sentences or less)
  1 indicates standard summary
  2 indicates extensive summary */

export async function summarise(transcript: string, level: number = 1) {
  let specification = "";
  if (level == 0) {
    specification = " in 3 sentences or less: ";
  } else if (level == 1) {
    specification = ": ";
  } else if (level == 2) {
    specification = " in great detail: ";
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Please can you summarise this" + specification + transcript }],
    model: "gpt-3.5-turbo",
  });

  const summary = completion.choices[0]["message"]["content"];

  return summary;
}