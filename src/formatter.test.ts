import { test, expect } from 'vitest';
import { format } from '../src/lib/server/formatter';

const lecture1_latex: string = `\\documentclass{article}
\\usepackage[utf8]{inputenc}

\\title{Summary of Personal Statement}
\\author{\\textbf{Preesha Gehlot}}
\\date{}

\\begin{document}

\\maketitle

I'm Preesha Gehlot, currently in my third year studying Computing at Imperial College London. Nestled near Chelsea in the heart of London, I'm deeply engaged in a captivating software engineering project focused on the auto summarization of lectures. 
This endeavor allows me to blend my passion for technology with the dynamic world of education. Within my academic journey, I've found particular joy in exploring the intricacies of data processing, concurrency, and compilers. These modules have not only broadened my understanding but also fueled my curiosity for 
the ever-evolving landscape of computing. Beyond the realm of code and algorithms, I embrace an active lifestyle. Whether it's the rhythmic beat of my running shoes hitting the pavement or the strategic intensity of a tennis match, I find solace and exhilaration in staying active. Reading serves as a constant companion, 
and my favorite movie, "Good Will Hunting," mirrors my appreciation for compelling narratives. On the tennis court, my admiration extends to Nick Kyrgios, whose mischievous on-court persona adds a touch of spontaneity to the game. Looking ahead, post-graduation holds the promise of adventure as I dream of traversing the 
diverse landscapes and cultures of Asia. This upcoming journey embodies my insatiable curiosity and eagerness to explore the world beyond the confines of academia.

\\end{document}`;

// the following transcript is taken frm https://www.webpages.uidaho.edu/psyc390/lessons/lesson05/transcript_5-3.htm
const lecture2_latex: string = `\\documentclass{article}
\\usepackage[utf8]{inputenc}

\\title{Summary of Personal Statement}
\\author{\\textbf{Preesha Gehlot}}
\\date{}

\\begin{document}

\\maketitle

In the last section, we examined some early aspects of memory. In this section, what we’re going to do is discuss some factors that influence memory. So let’s do that by beginning with the concept on slide two, and that concept is overlearning. Basically in overlearning, the idea is that you continue to study something after you can recall it perfectly. So you study some particular topic whatever that topic is. When you can recall it perfectly, you continue to study it.
This is a classic way to help when one is taking comprehensive finals later in the semester. So when you study for exam one and after you really know it all, you continue to study it. That will make your comprehensive final easier.
The next factor that will influence memory relates to what we call organization. In general, if you can organize material, you can recall it better. There are lots of different types of organizational strategies and I’ve listed those on slide four. So let’s begin by talking about the first organizational strategy called clustering and is located on page five.
In clustering, basically you recall items better if you can recognize that there are two or more types of things in a particular list. So let’s give a couple of lists and show you some examples of that. These examples are shown in slide six.
Let’s say that I give you the first list; north, cardinal, south, robin, east, wren, west, sparrow. Now if you can recognize that north, south, east and west are points on a compass and cardinal, robin, wren and sparrow are birds, then you have a higher probability of recalling that material than if you just tried to recall the list in order.
The same occurs with the second list that is located on the right hand side of page six. So let’s list these words as well; pig, cat, horse, dog, sheep, birds, cow, and fish. Now if you can recognize that these are two groups of animals; one being farm animals and the other being domestic companions, ala, pets, then you can recall that list of material better than if you just tried to recall the list in order. So again, this is another type of example of organizational strategy.
Now there are other organizational strategies that one can use as well. The next one of these, as we see on slide seven, are what are called verbal pneumonic techniques. In verbal pneumonic techniques, you make your own organization and there are many, many different types of techniques. So let’s talk about the first of these on slide eight and that is called acrostics. In acrostics these are phrases in which the first letter of each word functions as a cue to help you recall some piece of information. There are a variety of different acrostics that one uses. The most famous of these relates to this saying: On Old Olympus Towering Tops A Fin And German Vented Some Hops. These relate to the twelve different cranial nerves that we have within the brain and if you are a traditional medical student or taking anatomy and physiology, this is the acrostic that you usually use to remember them.
Now there are other verbal pneumonic techniques as well.

\\end{document}`;

const default_customisation = {
	highlight_keywords: false,
	questions: false,
	summary_format: '',
	length: 1
};

test('1 page of short transcript remains in LaTeX format', async () => {
	const summary = await format(lecture1_latex, default_customisation);

	let is_latex = false;
	if (summary != null) {
		is_latex = summary.includes(`\\begin{document}`);
	}

	expect(is_latex).toStrictEqual(true);
}, 70000);

test('1 page of short transcript in LaTeX format with highlighted keywords', async () => {
	let customisation = {};
	customisation = Object.assign(customisation, default_customisation);
	customisation.highlight_keywords = true;

	const summary = await format(lecture1_latex, customisation);

	let has_highlights = false;
	if (summary != null) {
		has_highlights = summary.includes('\\textbf') || summary.includes('\\keyword');
	}

	expect(has_highlights).toStrictEqual(true);
}, 70000);

test('1 page of short transcript in LaTeX format with bullet points', async () => {
	let customisation = {};
	customisation = Object.assign(customisation, default_customisation);
	customisation.summary_format = ' in bullet point format ';

	const summary = await format(lecture1_latex, customisation);

	let has_bullet_points = false;
	if (summary != null) {
		has_bullet_points = summary.includes('\\item') || summary.includes('\n- ');
	}

	expect(has_bullet_points).toStrictEqual(true);
}, 70000);

test('1 page of short transcript in LaTeX format with both highlighted keywords and bullet points', async () => {
	let customisation = {};
	customisation = Object.assign(customisation, default_customisation);
	customisation.summary_format = ' in bullet point format ';
	customisation.highlight_keywords = true;

	const summary = await format(lecture1_latex, customisation);

	let has_bullet_points = false;
	if (summary != null) {
		has_bullet_points = summary.includes('\\item') || summary.includes('\n- ');
	}

	let has_highlights = false;
	if (summary != null) {
		has_highlights = summary.includes('\\textbf') || summary.includes('\\keyword');
	}

	expect(has_bullet_points).toStrictEqual(true);
	expect(has_highlights).toStrictEqual(true);
}, 70000);

test('1 page of short transcript in LaTeX format with revision section', async () => {
	let customisation = {};
	customisation = Object.assign(customisation, default_customisation);
	customisation.questions = true;

	const summary = await format(lecture1_latex, customisation);

	let has_revision_section = false;
	if (summary != null) {
		has_revision_section =
			summary.includes('Question') ||
			summary.includes('Question 1') ||
			summary.includes('Q') ||
			summary.includes('Q1') ||
			summary.includes('question') ||
			summary.includes('Revision');
	}

	expect(has_revision_section).toStrictEqual(true);
}, 70000);

test('1 page of short transcript in LaTeX format with bullet points, highlighted keywords and revision section', async () => {
	let customisation = {};
	customisation = Object.assign(customisation, default_customisation);
	customisation.questions = true;
	customisation.summary_format = ' in bullet point format ';
	customisation.highlight_keywords = true;

	const summary = await format(lecture1_latex, customisation);

	let has_revision_section = false;
	if (summary != null) {
		has_revision_section =
			(summary.includes('Question') && summary.includes('Answer')) ||
			(summary.includes('Question 1') && summary.includes('Answer 1')) ||
			(summary.includes('Q') && summary.includes('A')) ||
			(summary.includes('Q1') && summary.includes('A1')) ||
			summary.includes('Revision');
	}

	let has_bullet_points = false;
	if (summary != null) {
		has_bullet_points = summary.includes('\\item') || summary.includes('\n- ');
	}

	let has_highlights = false;
	if (summary != null) {
		has_highlights = summary.includes('\\textbf') || summary.includes('\\keyword');
	}

	expect(has_revision_section).toStrictEqual(true);
	expect(has_bullet_points).toStrictEqual(true);
	expect(has_highlights).toStrictEqual(true);
}, 70000);

test('1 page of realistic transcript in LaTeX format with bullet points, highlighted keywords and revision section', async () => {
	let customisation = {};
	customisation = Object.assign(customisation, default_customisation);
	customisation.questions = true;
	customisation.summary_format = ' in bullet point format ';
	customisation.highlight_keywords = true;

	const summary = await format(lecture2_latex, customisation);

	let has_revision_section = false;
	if (summary != null) {
		has_revision_section =
			(summary.includes('Question') && summary.includes('Answer')) ||
			(summary.includes('Question 1') && summary.includes('Answer 1')) ||
			(summary.includes('Q') && summary.includes('A')) ||
			(summary.includes('Q1') && summary.includes('A1'));
	}

	let has_bullet_points = false;
	if (summary != null) {
		has_bullet_points = summary.includes('\\item') || summary.includes('\n- ');
	}

	let has_highlights = false;
	if (summary != null) {
		has_highlights = summary.includes('\\textbf') || summary.includes('\\keyword');
	}

	expect(has_revision_section).toStrictEqual(true);
	expect(has_bullet_points).toStrictEqual(true);
	expect(has_highlights).toStrictEqual(true);
}, 70000);
