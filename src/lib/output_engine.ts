import * as childProcess from 'child_process'
import { Pandoc, type PandocOutFormat } from "pandoc-ts";

const DEFAULT_FILE_NAME: string = 'summary';

export enum OutputType {
    PDF,
    TEX,
    DOC,
    TXT
}

function createOuts(fileName: string): Record<OutputType, PandocOutFormat[]> {
    return ({
        [OutputType.TEX]: [{ name: "latex", format: "latex", fname: fileName + ".tex", outBin: false },],
        [OutputType.DOC]: [{ name: "wordDoc", format: "docx", fname: fileName + ".docx", outBin: false },],
        [OutputType.TXT]: [{ name: "plainText", format: "plain", fname: fileName + ".txt", outBin: false },],
        [OutputType.PDF]: [{ name: "pdf", format: "pdf", fname: fileName + ".pdf", outBin: false },]
    });
}

// do not need save parameter anymore
export function output(latexCode: string, fileName: string = DEFAULT_FILE_NAME, outputType: OutputType = OutputType.PDF, save: boolean = false) {
    const pandocFormat = createOuts(fileName)[outputType][0];
    if(outputType === OutputType.PDF){
        const pdfEngine = 'xelatex';
        const pandocCommand = `pandoc -f latex -s -o "${pandocFormat.fname}" --pdf-engine=${pdfEngine}`;
        const child = childProcess.exec(pandocCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
            } else {
                console.log(`PDF file was generated: ${pandocFormat.fname}`);
            }
        });

        child.stdin.write(latexCode);
        child.stdin.end();
    } else {
        const pandocInstance = new Pandoc("latex", [pandocFormat]);
        pandocInstance.convert(latexCode, (result, err) => {
            if (err) {
                console.error(err);
            }
            if (result) {
                console.log(`${pandocFormat.format.toUpperCase()} file was generated: ${pandocFormat.fname}`);
            }
        });
    }
    
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
    output(summaryexample, undefined, OutputType.DOC);
}
