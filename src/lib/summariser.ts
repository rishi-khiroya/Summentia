import { openai } from './openai_clinet';

export async function summarise(transcript: string, detail_level: number = 1){

  // Adds prompt the level parameter for the extent of a given summary
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

  const prompt = "Please summarise this" +  detail_phrase + transcript;
  

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt}],
      model: "gpt-3.5-turbo",
  });

  const summary = completion.choices[0]["message"]["content"];

	console.log('Prompt : ');
	console.log(prompt);
	console.log('Summary : ');
	console.log(summary);

	return summary;
}
