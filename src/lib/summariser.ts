import OpenAI from "openai";
const openai = new OpenAI();

/* For the level parameter:
  0 indicates brief summary (2 sentences or less)
  1 indicates standard summary
  2 indicates extensive summary */

export async function summarise(transcript: String, level: number = 1, latex_flag: boolean = true){
  
  let latex = "";
  if (latex_flag){
    latex = " in LaTeX format "
  }

  let specification = "";
  switch (level){
    case 0:
      specification = " in 3 sentences or less: ";
      break;
    case 1:
      specification = "";
      break;
    case 2:
      specification = " in great detail: ";
      break;
    default:
      break;
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Please can you summarise this" + latex + specification + transcript}],
      model: "gpt-3.5-turbo",
  });

  let summary = completion.choices[0]["message"]["content"];
        
  return summary;
}