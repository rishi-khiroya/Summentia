import OpenAI from "openai";
const openai = new OpenAI();

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

export async function summarise(transcript: String, detail_level: number = -1, 
  latex_flag: boolean = true, length: number = -1, 
  highlight_keywords: boolean = false, 
  bullet_points: boolean = false, questions: boolean = false){
  
  // adds LaTeX format prompt if the latex_flag has been set to true
  let latex_phrase = "";
  if (latex_flag){
    latex_phrase = " in LaTeX format ";
  }

  let highlight_phrase = "";
  if (highlight_keywords){
    highlight_phrase = " with the keywords highlighted ";
  }

  let bullet_point_phrase = "";
  if (bullet_points){
    bullet_point_phrase = " as bullet points ";
  }

  let questions_phrase = "";
  if (questions){
    questions_phrase = " with a question and answer revision section at the end "
  }

  // adds length prompt for length upper bound in pages, default set to 1
  let length_phrase = "";
  switch (length){

    // Small summary document
    case 0:
      length_phrase = " in under 1 page ";
      break;

    // Medium summary document
    case 1:
      length_phrase = " in under 3 pages ";
      break;

    // Large summary document
    case 2:
      length_phrase = " in under 6 pages ";
      break;

    default:
        break;
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

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Please can you summarise this" + bullet_point_phrase + highlight_phrase + questions_phrase +
    latex_phrase + detail_phrase + length_phrase + transcript}],
      model: "gpt-3.5-turbo",
  });

  let summary = completion.choices[0]["message"]["content"];
        
  return summary;
}