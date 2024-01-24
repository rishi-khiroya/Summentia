import * as fs from 'fs';

const fileName = 'summary.tex';

function generateLatexFile(latexCode: string): void {
    fs.writeFileSync(fileName, latexCode, 'utf-8');
}



