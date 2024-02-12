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
import type { Slides } from './Slides';

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

	private slidesArrayToString() {
		const slides: Slides | undefined = this.lecture.supplementaryInfo.slides;
		if (!slides) return null;
		const json = {
			'num_slides': slides.noSlides,
			'slides': slides.slides
		}
		return JSON.stringify(json);
	}

	private async timestamp(video_path: string): Promise<boolean> {

		const slidesJSON = this.slidesArrayToString();
		if (!slidesJSON) return false;

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
		if (!this.timestamps) return false;

		const path: string = await this.lecture.toFilePath();
		const extlessPath: string = path.substring(0, path.lastIndexOf('.'));

		const transcripts: string[] | null = await transcribe(extlessPath, this.timestamps);
		if (!transcripts) return false;
		

		this.transcripts = transcripts.map((transcript, index) => {
			return { id: index, text: transcript };
		});
		return true;
	}

	private async summarise(): Promise<boolean> {
		if (!this.transcripts?.length) return false;

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
		if (withLogs) console.log('Timestamping...');
		if (!(await this.timestamp("video_name"))) return false;
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
