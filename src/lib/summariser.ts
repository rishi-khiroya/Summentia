import OpenAI from "openai";
const openai = new OpenAI();

/* For the level parameter:
  0 indicates brief summary (2 sentences or less)
  1 indicates standard summary
  2 indicates extensive summary */

export async function summarise(transcript: String, level: number){
  let specification = "";
  switch (level) {
    case 0:
      specification = " in 2 sentences or less: ";
    case 1:
      specification = ": ";
    case 2:
      specification = " in great detail: ";
  }
  const completion = await openai.chat.completions.create({
      
    messages: [{ role: "system", content: "Please can you summarise this" + specification + transcript}],
      model: "gpt-3.5-turbo",
  });

  let summary = completion.choices[0]["message"]["content"];
        
  return summary;
}