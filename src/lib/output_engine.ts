import * as fs from 'fs';

const DEFAULT_FILE_NAME: string = 'summary';

function generateLatexFile(latexCode: string, fileName: string): void {
    fs.writeFileSync(fileName + ".tex", latexCode, 'utf-8');
}

function generateAndDownloadLatex(latexCode: string, fileName: string = DEFAULT_FILE_NAME): void {

    // Create a Blob with the LaTeX content
    const blob = new Blob([latexCode], { type: 'application/x-latex' });

    // Create a link element
    const link = document.createElement('a');
    link.download = fileName + ".tex";
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);

    // Trigger a click event on the link to start the download
    link.click();

    document.body.removeChild(link);
}

export enum OutputType {
    PDF,
    TEX,
    DOC,
    TXT
}

export function output(latexCode: string, fileName: string = DEFAULT_FILE_NAME, outputType: OutputType = OutputType.PDF, save: boolean = false) {
    switch (outputType) {
        case OutputType.PDF:
            // TODO
            break;
        case OutputType.TEX:
            if (save) generateLatexFile(latexCode, fileName);
            generateAndDownloadLatex(latexCode, fileName);
            break;
        case OutputType.DOC:
            // TODO
            break;
        case OutputType.TXT:
            // TODO
            break;
    }
}