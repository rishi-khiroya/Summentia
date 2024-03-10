import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import type { Customisation } from '$lib/types/Customisation';

// TODO: extract openai client to its own exported thing
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// we assumed that transcript_code is a string of LaTeX code containing the summary
export async function format(transcript_code: string, customisations: Customisation) {
	let highlight_phrase = '';
	if (customisations.highlight_keywords) {
		highlight_phrase = ' highlight keywords ';
	}

	let questions_phrase = '';
	if (customisations.questions) {
		questions_phrase = ' with a revision question answer section';
	}

	/* adds length prompt for length upper bound in pages, default set to 1
	let length_phrase = '';
	if (customisations.length != -1) {
		if (customisations.length == 1) {
			length_phrase = ' in 1 page ';
		} else {
			length_phrase = ' in ' + customisations.length + ' pages ';
		}
	}*/

	const prompt =
		'Plase give me this LaTeX code, ' +
		highlight_phrase +
		customisations.summary_format +
		questions_phrase +
		' :' +
		transcript_code;

	const completion = await openai.chat.completions.create({
		messages: [{ role: 'system', content: prompt }],
		model: 'gpt-3.5-turbo'
	});

	const summary = completion.choices[0]['message']['content'];

	let latex_code: string = "";
	if (summary != null && summary.includes("\\documentclass{article}")){
		latex_code  = "\\documentclass{article}" + ((summary.split("\\documentclass{article}"))[1]).split("\\end{document}")[0] + "\\end{document}";
	} else if (summary != null && summary.includes("\\begin{document}")){
		latex_code  = "\\begin{document}" + ((summary.split("\\documentclass{article}"))[1]).split("\\end{document}")[0] + "\\end{document}";
	}

	console.log("--------PROMPT-----------\n" + prompt + "\n\n");
	console.log("--------CODE-----------\n" + latex_code + "\n\n");
	console.log("--------SUMMARY-----------\n" + summary + "\n\n");
	return latex_code;
}

export async function generateFlashCards(summary: string){
	const prompt: string = 'Can you generate flash cards in format Front: Back:, Front: Back: : ' + summary;
	const completion = await openai.chat.completions.create({
		messages: [{ role: 'system', content: prompt }],
		model: 'gpt-3.5-turbo'
	});

	const response = completion.choices[0]['message']['content'];

	console.log("response: " + response);
	return response;
}
