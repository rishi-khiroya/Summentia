
import * as childProcess from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { Pandoc, type PandocOutFormat } from 'pandoc-ts';

const DEFAULT_FILE_NAME: string = 'summary';

export enum OutputType {
	PDF,
	TEX,
	DOCX,
	TXT
}

function createOuts(fileName: string): Record<OutputType, PandocOutFormat[]> {
	return {
		[OutputType.TEX]: [{ name: 'latex', format: 'latex', fname: fileName + '.tex', outBin: false }],
		[OutputType.DOCX]: [
			{ name: 'wordDoc', format: 'docx', fname: fileName + '.docx', outBin: false }
		],
		[OutputType.TXT]: [
			{ name: 'plainText', format: 'plain', fname: fileName + '.txt', outBin: false }
		],
		[OutputType.PDF]: [{ name: 'pdf', format: 'pdf', fname: fileName + '.pdf', outBin: false }]
	};
}

// do not need save parameter anymore
export async function output(
	latexCode: string,
	fileName: string = DEFAULT_FILE_NAME,
	outputType: OutputType = OutputType.PDF

) {
	const pandocFormat = createOuts(fileName)[outputType][0];
	try {
		if (outputType === OutputType.PDF) {

			writeFileSync(`${fileName}.tex`, latexCode);
			const pandocCommand = `pdflatex ${fileName}.tex`;

			childProcess.execSync(pandocCommand);

			unlinkSync(`${fileName}.tex`);
		} else {
			const pandocInstance = new Pandoc('latex', [pandocFormat]);
			await pandocInstance.convertAsync(latexCode);
		}
	} catch (err) {
		console.log("ouptut engine error: " + outputType);
		return false;
	}
	return true;
}

// function used for testing
function exmaple() {
	const summaryexample = `
    \\documentclass{article}
    
    \\title{My First Document}
    \\author{Your Name}
    \\date{\\today}
    
    \\begin{document}
    
    \\maketitle
    
    \\section{Introduction}
    This is a simple example document in \\LaTeX. We can include sections, create lists, and use mathematical notation like $E=mc^2$.
    
    \\subsection{Lists}
    \\begin{itemize}
      \\item Item 1
      \\item Item 2
      \\item Item 3
    \\end{itemize}
    
    \\subsection{Equation}
    A quadratic equation can be expressed as:
    \\begin{equation}
      ax^2 + bx + c = 0
    \\end{equation}
    
    \\end{document}
    `;

	output(summaryexample, undefined, OutputType.PDF);
	output(summaryexample, undefined, OutputType.TXT);
	output(summaryexample, undefined, OutputType.TEX);
	output(summaryexample, undefined, OutputType.DOCX);
}
