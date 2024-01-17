import { expect, test } from '@playwright/test';
import {Lecture} from "../src/lib/lecture";
import {Summariser} from "../src/lib/summariser";

let lecture1 = new Lecture("Preesha's intro", new Date(), `I'm Preesha Gehlot, currently in my third year studying Computing at Imperial College London. Nestled near Chelsea in the heart of London, I'm deeply engaged in a captivating software engineering project focused on the auto summarization of lectures. 
This endeavor allows me to blend my passion for technology with the dynamic world of education. Within my academic journey, I've found particular joy in exploring the intricacies of data processing, concurrency, and compilers. These modules have not only broadened my understanding but also fueled my curiosity for 
the ever-evolving landscape of computing. Beyond the realm of code and algorithms, I embrace an active lifestyle. Whether it's the rhythmic beat of my running shoes hitting the pavement or the strategic intensity of a tennis match, I find solace and exhilaration in staying active. Reading serves as a constant companion, 
and my favorite movie, "Good Will Hunting," mirrors my appreciation for compelling narratives. On the tennis court, my admiration extends to Nick Kyrgios, whose mischievous on-court persona adds a touch of spontaneity to the game. Looking ahead, post-graduation holds the promise of adventure as I dream of traversing the 
diverse landscapes and cultures of Asia. This upcoming journey embodies my insatiable curiosity and eagerness to explore the world beyond the confines of academia.`);

test('accurate summary of short transcript', async () => {
	let text = lecture1.getText();
    let summariser = new Summariser();
    let summary = await summariser.summarise(text);
    const keyWords = new Set<String>(['preesha', 'gehlot', 'computing', 'imperial', 'london', 'data', 'processing', 'concurrency', 'compilers', 'running', 'tennis', 'nick', 'kyrgios', 'travelling', 'asia', 'reading', 'graduation', 'good', 'will', 'hunting']);

    var splitted = (summary == null ? "" : summary).split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );

    let count = 0;
    function update_count(item: String){
            console.log(item);
            if (keyWords.has(item.toLowerCase())){
                count += 1;
            }
    }

    splitted.forEach(update_count);
    
    expect(count).toBeGreaterThan(16);
});