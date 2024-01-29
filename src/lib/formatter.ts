import { OPENAI_API_KEY } from "$env/static/private";
import OpenAI from "openai";
import type {Customisation} from "$lib/types/Customisation";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// we assumed that transcript_code is a string of LaTeX code containing the summary
export async function format(transcript_code: string, Customisations: Customisation){

  let highlight_phrase = "";
  if (Customisations.highlight_keywords){
    highlight_phrase = " with the keywords highlighted ";
  }
  
  let questions_phrase = "";
  if (Customisations.questions){
    questions_phrase = " with a question and answer revision section at the end "
  }

  // adds length prompt for length upper bound in pages, default set to 1
  let length_phrase = "";
  if (Customisations.length != -1){
    if (Customisations.length == 1){
      length_phrase = " in 1 page ";
    } else {
      length_phrase = " in " + Customisations.length + " pages ";
    }
    
  }

  // Adds prompt the level parameter for the extent of a given summary
  // Use for intermediate summaries (non LaTeX), and testing
  let detail_phrase = "";
  switch (Customisations.detail_level){
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
  if (Customisations.latex_flag){
    prompt = "Please summarise the following text as LaTeX code, " + length_phrase + " of LaTeX code (it MUST be in LaTeX code) : " + transcript;
  } else {
    prompt = "Please summarise this" +  detail_phrase + transcript;
  }

  let completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt}],
      model: "gpt-3.5-turbo",
  });

  let summary = completion.choices[0]["message"]["content"];

  if (highlight_phrase || Customisations.summary_format || questions_phrase){
    prompt = "please give me the following LaTeX code " + highlight_phrase + Customisations.summary_format + questions_phrase + ": " + summary
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