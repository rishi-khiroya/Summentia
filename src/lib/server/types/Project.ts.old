import { OutputType, output } from '$lib/output_engine';
import { summarise } from '$lib/summariser';
import { transcribe } from '$lib/transcriber';
import { Lecture } from './Lecture';
import type { Summary } from './Summary';
import type { Transcript } from './Transcript';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { Customisation } from './Customisation';
import { format } from '$lib/formatter';
import { generateFinalLatexCode } from '$lib/latex_generation';

const MAX_PATH_LENGTH = 16;

export class Project {
	readonly title: string;
	readonly date: Date;

	// Internal representations at each stage.
	private readonly lecture: Lecture;
	private readonly customisation: Customisation | undefined;
	// private transcript: Transcript | undefined;
	private transcripts: Transcript[] | undefined;
	// private summary: Summary | undefined;
	private summaries: Summary[] | undefined;
	private readonly userId: string;
	private timestamps: object[] | undefined;
	private out: string | null = null;

	static from(title: string, date: Date, form: FormData): Project {
		const userId = form.get('userId');
		if (!userId) error(400, 'No UserID provided.');
		// TODO: pass formatting in from form
		return new Project(title, date, Lecture.fromForm(form), userId.toString(), undefined);
	}

	public constructor(
		title: string,
		date: Date,
		lecture: Lecture,
		userId: string,
		customisation: Customisation | undefined
	) {
		this.title = title;
		this.date = date;
		this.lecture = lecture;
		this.userId = userId;
		this.customisation = customisation;
	}

	private async timestamp(): Promise<boolean> {
		const video_path = 'video.mp4';
		const slidesJSON = `{\
                "num_slides": 7,\
                "slides": [\
                        "slides/Slides - Module 2 - K-NN and Decision Trees-01.png",\
                        "slides/Slides - Module 2 - K-NN and Decision Trees-02.png",\
                        "slides/Slides - Module 2 - K-NN and Decision Trees-03.png",\
                        "slides/Slides - Module 2 - K-NN and Decision Trees-04.png",\
                        "slides/Slides - Module 2 - K-NN and Decision Trees-05.png",\
                        "slides/Slides - Module 2 - K-NN and Decision Trees-06.png",\
                        "slides/Slides - Module 2 - K-NN and Decision Trees-07.png"\
                ]\
        }`;

		const response: Response = await fetch('http://localhost:8000/get_timestamps', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				video_path: video_path,
				slides_json: slidesJSON
			})
		});
		const data = JSON.parse((await response.json()).data);
		console.log(data);
		if (!data) return false;

		this.timestamps = data;
		return true;
	}

	private async transcribe(): Promise<boolean> {
		// const path: string = await this.lecture.toFilePath();
		// const extlessPath: string = path.substring(0, path.lastIndexOf('.'));

		const transcripts: string[] = [
			'Hello everybody, and welcome to this second lecture for the Introduction to Machine Learning course.',
			"You probably have already seen this course plan last week in Josiah's lecture, and today we are in week three, so we will cover instance-based learning and decision trees algorithm. Next week, I will leave the floor to my colleague Marek, that will be covering evaluation of machine learning algorithms and how we can actually compare, so first of all, quantify the performance and compare different algorithms together. Then it will be also covered in the next two weeks, the neural networks part of the course, and then I will see you again for the unsupervised learning algorithm and the genetic algorithm for the two last lectures of this term. So as I said, today we will be covering the instance-based learning and decision tree.",
			'tree algorithm and more specifically we will cover in the first part of the lecture the k-nearest neighbor algorithm and then we will cover an algorithm used to train or to generate decision trees which is called the ID-free algorithm.',
			"The reason why we are covering those two algorithms is because they actually belong to two different bigger classes of algorithms that are called the lazy learners and the eager learners. More specifically, the k-nearest neighbor is part of the lazy learner while the decision tree is part of the eager learner. The idea behind the lazy learner here is that the lazy learner will actually just store all the training examples in a data set and just postpone any type of processing on those data until an explicit request is made at test time. So typically when the user requests the model or the machine learning algorithm to make a prediction, then it's only there that the algorithm will actually do something and do some work. It's lazy in a sense that it's waiting the very last moment to do any type of work. On the other hand, the eager learner here will actually try to learn beforehand an explicit representation of the target function. The target function is what you can for instance see here and it will learn this prior any query. So then after learning this explicit function, it can actually discard and get rid of all the training data sets and training examples and just maintain in memory this target decision function and use this later when the user makes some queries or wants some prediction to be done.",
			"So, for today's lecture, we will, as I said, first cover the classification with instance-based learning and, more specifically, the k-nearest neighbor algorithm. We will also see some variants of these k-NN algorithms, distance-weighted k-nearest neighbor algorithms, and we will just finish this part with a very brief introduction on how we can also use k-nearest neighbor algorithms for regression. Then in the second part of this lecture today, we will see how we can create decision trees and use decision trees to do some classification tasks. In particular, we will start with some intuition and motivation, then I will introduce the information entropy, that is a very fundamental concept in information theory, and then you will see how we can derive from the information entropy the information gain that is very central in the creation of decision trees. Then I will cover the overall algorithm of the decision trees, ID3 again, and I will show you in a worked example, step by step, how we can apply this algorithm on a very simple dataset. Finally, we will end this lecture with some further consideration about, for instance, how a decision tree can overfit, and how we can also apply an extended version of decision trees that are called random forests, and also regression trees as a brief introduction.",
			"The lecture today is actually divided into six smaller videos. The first one is this current short introduction that will lays or that is actually laying down the different elements of this course and then the next video will be about the classification using k-nearest neighbor, so instance-based learning, then it's classification using decision trees, then how we can use and select the optimal split rules, you will see later why it's that important, then I cut and move the worked example in a separate video so you can find it whenever you want if you want to go back in specific details, and finally we will finish with a summary and some general consideration about decision trees and specifically how we can deal with overfitting. So first of all what is overfitting and how we can deal with overfitting in the case of decision trees.",
			"So, that's the end for this first clip, and I invite you to move on to the next one, which will be about classification using instance-based learning. See you soon!"
		];

		this.transcripts = transcripts.map((transcript, index) => {
			return { id: index, text: transcript };
		});
		return true;

		// const transcript: string | null = await transcribe(extlessPath);
		// if (!transcript) return false;

		// this.transcript = { text: transcript };
		// return true;
	}

	private async summarise(): Promise<boolean> {
		if (!this.transcripts?.length) return false;

		// const summary: string | null = await summarise(this.transcript?.text);
		// if (!summary) return false;

		// this.summary = { text: summary };
		// return true;

		const summaries: string[] = [];

		for (const transcript of this.transcripts) {
			const summary: string | null = await summarise(transcript.text);
			if (!summary) return false;
			summaries.push(summary);
		}

		this.summaries = summaries.map((summary, index) => {
			return { id: index, text: summary };
		});
		return true;
	}

	private async format(output: string): Promise<string | null> {
		// if (!(this.summaries?.length && this.customisation)) return false;

		// for (const summary of this.summaries) {
		// 	const data = await format(summary.text, this.customisation);
		// 	if (!data) return false;
		// 	summary.text = data;
		// }

		if (!this.customisation) return null;
		return await format(output, this.customisation);
	}

	private async addSlidesToSummaries(): Promise<string | null> {
		if (!this.lecture.supplementaryInfo?.slides?.slides?.length || !this.summaries?.length)
			return null;

		return generateFinalLatexCode(
			this.lecture.supplementaryInfo.slides.slides,
			this.summaries.map((summary) => summary.text),
			this.title,
			'TODO'
		);
	}

	// private async saveToDb() {
	// 	await prisma.project.create({
	// 		data: {
	// 			title: this.title,
	// 			date: this.date,
	// 			userId: this.userId,
	// 			transcript: this.transcript?.text,
	// 			summary: this.summary?.text
	// 		}
	// 	});
	// }

	public async process(withLogs: boolean = false): Promise<boolean> {
		if (withLogs) console.log('Transcribing...');
		if (!(await this.transcribe())) return false;
		if (withLogs) console.log('Summarising...');
		// if (!(await this.summarise())) return false;
		if (withLogs) console.log('Adding slides to summaries (if needed)...');
		// if (!(await this.addSlidesToSummaries())) return false;
		this.out = await this.addSlidesToSummaries();
		if (!this.out) return false;
		if (withLogs) console.log('Trying to format (if needed)...');
		// if (!(await this.format(output))) return false;
		this.out = await this.format(this.out);
		if (!this.out) return false;
		if (withLogs) console.log('Cleaning Up...');
		await this.lecture.cleanup();
		// if (withLogs) console.log('Saving to DB...');
		// await this.saveToDb();
		if (withLogs) console.log('Processed.');
		return true;
	}

	// public log(): void {
	// 	if (this.transcript) console.log(`Transcripts:\n${this.transcript.text}\n`);
	// 	if (this.summary) console.log(`Summarys:\n${this.summary.text}\n`);
	// }

	public output(): void {
		const sanitiseFileName = (title: string) => {
			let fileName: string = title.substring(0, MAX_PATH_LENGTH); // take first MAX_PATH_LENGTH chars
			fileName = fileName.replace(/ /g, '_'); // replaces whitespace with underscores
			fileName = fileName.replace(/[^a-zA-Z0-9]/g, ''); // remove all non-alphanumeric chars
			return fileName;
		};

		if (!this.out) return;

		output(this.out, sanitiseFileName(this.title), OutputType.PDF);
	}
}
