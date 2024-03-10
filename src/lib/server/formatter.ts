import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import type { Customisation } from '$lib/types/Customisation';

// TODO: extract openai client to its own exported thing
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// we assumed that transcript_code is a string of LaTeX code containing the summary
export async function format(transcript_code: string, customisations: Customisation) {
	let code_in_progress: string = transcript_code;

	if (customisations.highlight_keywords) {

		const prompt =
		'Give me this LaTeX code and make the keywords bold : ' +
		transcript_code;

		const completion = await openai.chat.completions.create({
			messages: [{ role: 'system', content: prompt }],
			model: 'gpt-3.5-turbo'
		});

		code_in_progress = completion.choices[0]['message']['content']??code_in_progress;
		console.log("\n\nHIGHLIGHTED-----------\n\n" + code_in_progress);
	}

	if (customisations.questions) {
		const prompt =
		'Please give me this LaTeX code with a revision question answer section at the end: ' +
		code_in_progress;

		const completion = await openai.chat.completions.create({
			messages: [{ role: 'system', content: prompt }],
			model: 'gpt-3.5-turbo'
		});

		code_in_progress = completion.choices[0]['message']['content']??code_in_progress;
		console.log("\n\nQUESTIONS-----------\n\n" + code_in_progress);
	}

	const prompt =
		'Please give me this LaTeX code, ' +
		customisations.summary_format + ' :' +
		code_in_progress;

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
