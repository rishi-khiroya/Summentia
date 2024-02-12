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
	private transcript: Transcript | undefined;
	private summary: Summary | undefined;
	private readonly userId: string;

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

	private async transcribe(): Promise<boolean> {
		const path: string = await this.lecture.toFilePath();
		const extlessPath: string = path.substring(0, path.lastIndexOf('.'));

		const transcript: string | null = await transcribe(extlessPath);
		if (!transcript) return false;

		this.transcript = { text: transcript };
		return true;
	}

	private async summarise(): Promise<boolean> {
		if (!this.transcript) return false;

		const summary: string | null = await summarise(this.transcript?.text);
		if (!summary) return false;

		this.summary = { text: summary };
		return true;
	}

	private async format(): Promise<boolean> {
		if (this.summary && this.customisation) {
			const data = await format(this.summary.text, this.customisation);
			if (!data) return false;
			this.summary.text = data;
			return true;
		} 
		
		return false;
	}

	private async addSlidesToSummaries(): Promise<boolean> {
		if (!this.lecture.supplementaryInfo?.slides?.slides?.length || !this.summary) return false;

		generateFinalLatexCode(
			this.lecture.supplementaryInfo.slides.slides,
			[this.summary?.text],
			this.title,
			'TODO'
		);

		return true;
	}

	private async saveToDb() {
		await prisma.project.create({
			data: {
				title: this.title,
				date: this.date,
				userId: this.userId,
				transcript: this.transcript?.text,
				summary: this.summary?.text
			}
		});
	}

	public async process(withLogs: boolean = false): Promise<boolean> {
		if (withLogs) console.log('Transcribing...');
		if (!(await this.transcribe())) return false;
		if (withLogs) console.log('Summarising...');
		if (!(await this.summarise())) return false;
		if (withLogs) console.log('Adding slides to summaries (if needed)...');
		if (!(await this.addSlidesToSummaries())) return false;
		if (withLogs) console.log('Trying to format (if needed)...');
		if (!(await this.format())) return false;
		if (withLogs) console.log('Cleaning Up...');
		await this.lecture.cleanup();
		if (withLogs) console.log('Saving to DB...');
		await this.saveToDb();
		if (withLogs) console.log('Processed.');
		return true;
	}

	public log(): void {
		if (this.transcript) console.log(`Transcript:\n${this.transcript.text}\n`);
		if (this.summary) console.log(`Summary:\n${this.summary.text}\n`);
	}

	public output(): void {
		const sanitiseFileName = (title: string) => {
			let fileName: string = title.substring(0, MAX_PATH_LENGTH); // take first MAX_PATH_LENGTH chars
			fileName = fileName.replace(/ /g, '_'); // replaces whitespace with underscores
			fileName = fileName.replace(/[^a-zA-Z0-9]/g, ''); // remove all non-alphanumeric chars
			return fileName;
		};

		if (!this.summary) return;

		output(this.summary.text, sanitiseFileName(this.title), OutputType.PDF);
	}
}
