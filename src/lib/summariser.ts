import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function summarise(transcript: string, detailLevel: number = 1){

  // Adds prompt the level parameter for the extent of a given summary
  let detailPhrase = "";
  switch (detailLevel){
    case 0:
      detailPhrase = " in 3 sentences or less: ";
      break;
    case 1:
      detailPhrase = ": ";
      break;
    case 2:
      detailPhrase = " in great detail: ";
      break;
    default:
      break;
  }

  const prompt = "Please summarise this" +  detailPhrase + transcript;
  

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
