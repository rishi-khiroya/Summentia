export function getBodyLatexCode(slides: string[], summaries: string[]): string {
    // const slide_paths = getSlidePaths(slides);
    let body = '';
    for (let i = 0; i < slides.length; i++) {
        //const path = slides[i].slice(1);
        const path = slides[i];
        body += `
            \\begin{center}
            \\includegraphics[width=0.75\\linewidth]{${path}}
            \\end{center}
            \\subsection{} 
            ${summaries[i]}
        `;
    }
    return body;
}

export function getBodyKeyDefCode(definitions: string[]): string {
    let body = '';

    body += `
    \\section*{Key Definitions}
    \\begin{itemize}
    `

    for (let i = 0; i < definitions.length; i++){
        body += `
            \\item ${definitions[i]}
        `;
    }

    body += `
    \\end{itemize}
    `
    return body;
}

export function addToTemplate(title: string, author: string, body: string): string {
    return `
    \\documentclass{article}
    \\usepackage{graphicx}

    \\begin{document}
    
    \\title{${title}}
    \\author{${author}}
    \\date{\\vspace{-2em}}
    

    \\maketitle

    ${body}

    \\end{document}
    `;
}

export function generateFinalLatexCode(
    slides: string[],
    summaries: string[],
    title: string,
    author: string
): string {
    const body = getBodyLatexCode(slides, summaries);

    const code = addToTemplate(title, author, body);

    return code;
}
