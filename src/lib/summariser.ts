import OpenAI from "openai";
const openai = new OpenAI();

/* For the level parameter:
  0 indicates brief summary (2 sentences or less)
  1 indicates standard summary
  2 indicates extensive summary */

export async function summarise(transcript: String, level: number = 1){
  let specification = "";
  if (level == 0){
    specification = " in 3 sentences or less: ";
  } else if (level == 1){
    specification = ": ";
  } else if (level == 2){
    specification = " in great detail: ";
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Please can you summarise this" + specification + transcript}],
      model: "gpt-3.5-turbo",
  });

  let summary = completion.choices[0]["message"]["content"];
        
  return summary;
}