import { OPENAI_API_KEY } from "$env/static/private";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/* Customisations implemented:
      - size : Small (under 1 page), Medium (under 3 pages), Large (under 6 pages) 
      - highlight keywords
      - normal text or bullet points
    Extra features:
      - Generate revision question/answer section
*/

/* NOTES FOR ARGUMENT USE: 
   -  use detail_level when qlatex_flag is false, and use length when latex_flag is true
      because length involves num. of pages
   -  only set highlight_keywords or bullet_points to true when latex_flag is true
*/
/* Customisations implemented:
      - size : Small (under 1 page), Medium (under 3 pages), Large (under 6 pages) 
      - highlight keywords
      - normal text or bullet points
    Extra features:
      - Generate revision question/answer section
*/

/* NOTES FOR ARGUMENT USE: 
   -  use detail_level when qlatex_flag is false, and use length when latex_flag is true
      because length involves num. of pages
   -  only set highlight_keywords or bullet_points to true when latex_flag is true
*/

export async function summarise(transcript: string, detail_level: number = -1, 
  latex_flag: boolean = true, length: number = -1, 
  highlight_keywords: boolean = false, 
  summary_format: string = "", questions: boolean = false){

  let highlight_phrase = "";
  if (highlight_keywords){
    highlight_phrase = " with the keywords highlighted ";
  }
  
  let questions_phrase = "";
  if (questions){
    questions_phrase = " with a question and answer revision section at the end "
  }

  // adds length prompt for length upper bound in pages, default set to 1
  let length_phrase = "";
  if (length != -1){
    if (length == 1){
      length_phrase = " in 1 page ";
    } else {
      length_phrase = " in " + length + " pages ";
    }
    
  }

  // Adds prompt the level parameter for the extent of a given summary
  // Use for intermediate summaries (non LaTeX), and testing
  let detail_phrase = "";
  switch (detail_level){
    case 0:
      detail_phrase = " in 3 sentences or less: ";
      break;
    case 1:
      detail_phrase = ": ";
      break;
    case 2:
      detail_phrase = " in great detail: ";
      break;
    default:
      break;
  }
  let prompt;
  if (latex_flag){
    prompt = "Please summarise the following text" + length_phrase + " of LaTeX code (it MUST be in LaTeX code) : " + transcript;
  } else {
    prompt = "Please summarise this" +  detail_phrase + transcript;
  }

  let completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt}],
      model: "gpt-3.5-turbo",
  });

  let summary = completion.choices[0]["message"]["content"];

  if (highlight_phrase || summary_format || questions_phrase){
    prompt = "please give me the following LaTeX code " + highlight_phrase + summary_format + questions_phrase + ": " + summary
    completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt}],
        model: "gpt-3.5-turbo",
    });
  }
  summary = completion.choices[0]["message"]["content"];

  console.log("Prompt : ");
  console.log(prompt);
  console.log("Summary : ");
  console.log(summary);
        
  return summary;
}