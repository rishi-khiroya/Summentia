import OpenAI from "openai";
const openai = new OpenAI();

/* Customisations to implement:
      - size : Small (under 1 page), Medium (under 3 pages), Large (under 6 pages) 
      - highlight keywords
      - normal text or bullet points
    Extra features:
      - Generate revision question/answer section
*/

// NOTES : LaTeX format is also variable but not a customisation and will be true by default.
//       : detail_level should always be set to something so concat at end.
//       : detail_level may become redundant at summariser is integrated.
//       : I advise to only use detail_level when latex_flag is false, and use length when latex_flag is true (for now)

export async function summarise(transcript: String, detail_level: number = -1, latex_flag: boolean = true, length: number = 1){
  
  // adds LaTeX format prompt if the latex_flag has been set to true
  let latex_phrase = "";
  if (latex_flag){
    latex_phrase = " in LaTeX format "
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
  let specification_phrase = "";
  switch (detail_level){
    case 0:
      specification_phrase = " in 3 sentences or less: ";
      break;
    case 1:
      specification_phrase = ": ";
      break;
    case 2:
      specification_phrase = " in great detail: ";
      break;
    default:
      break;
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Please can you summarise this" + latex_phrase + specification_phrase + transcript}],
      model: "gpt-3.5-turbo",
  });

  let summary = completion.choices[0]["message"]["content"];
        
  return summary;
}