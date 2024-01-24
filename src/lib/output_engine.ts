import * as fs from 'fs';

const fileName = 'summary.tex';

function generateLatexFile(latexCode: string): void {
    fs.writeFileSync(fileName, latexCode, 'utf-8');
}

function generateAndDownloadLatex(latexCode: string): void {
    
    // Create a Blob with the LaTeX content
    const blob = new Blob([latexCode], { type: 'application/x-latex' });

    // Create a link element
    const link = document.createElement('a');
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);

    // Trigger a click event on the link to start the download
    link.click();

    document.body.removeChild(link);
}