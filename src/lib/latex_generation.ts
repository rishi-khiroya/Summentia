function getSlidePaths(slides_json: string): string[] {
    const parsed_slide = JSON.parse(slides_json);
    const slides_paths = parsed_slide.slides;
    return slides_paths;
}

function getBodyLatexCode(slides: string, summaries: string[]){
    const slide_paths = getSlidePaths(slides);
    let body = "";
    for (let i = 0; i < slide_paths.length; i++){
        body += `
            \\begin{center}
            \\includegraphics[width=0.75\\linewidth]{${slide_paths[i]}}
            \\end{center}
            \\subsection{} 
            ${summaries[i]}
        `
    }
    return body;
}

export function generateFinalLatexCode(slides: string, summaries:string[], title: string, author: string){

    const body = getBodyLatexCode(slides, summaries);

    const code = `
        \\documentclass{article}

        \\usepackage[none]{hyphenat}
        \\usepackage{graphicx}
        \\usepackage{geometry}
        \\geometry{
            a4paper,
            total={200mm,277mm},
            left=5mm,
            top=5mm,
        }

        \\renewcommand{\\thesubsection}{\\arabic{subsection})}
        \\renewcommand{\\thesubsubsection}{\\alph{subsubsection})}

        \\title{${title}}
        \\author{${author}}
        \\date{}

        \\begin{document}

        \\maketitle

        ${body}

        \\end{document}
        `

    return code;
}

