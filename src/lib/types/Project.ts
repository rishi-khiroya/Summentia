import type { Customisation } from './Customisation';
import { Lecture } from './Lecture';
import type { Slides } from './Slides';
import type { Summary } from './Summary';
import type { Timestamp } from './Timestamp';
import type { Transcript } from './Transcript';

export abstract class Project {
	// Basic information needed for a project.
	readonly title: string;
	readonly date: Date;
	private readonly lecture: Lecture;

	// Optional info.
	private readonly userId: string | undefined;
	private readonly customisation: Customisation | undefined;

	public constructor(
		title: string,
		date: Date,
		lecture: Lecture,
		userId: string | undefined,
		customisation: Customisation | undefined
	) {
		this.title = title;
		this.date = date;
		this.lecture = lecture;
		this.userId = userId;
		this.customisation = customisation;
	}

	static from(form: FormData): Project {
		const lecture = Lecture.fromForm(form);
		const slides = form.get('slides');
	}

	protected abstract transcribe(): Promise<boolean>;
	protected abstract summarise(): Promise<boolean>;
	protected abstract format(): Promise<boolean>;
	protected abstract saveToDB(): Promise<boolean>;
	protected abstract cleanup(): Promise<boolean>;

	public abstract output(): Promise<void>;

	// TODO: make and attach a proper error handler/logger to give the user more info about why something failed
	public async process(): Promise<boolean> {
		return (
			(await this.transcribe()) &&
			(await this.summarise()) &&
			(await this.format()) &&
			(await this.saveToDB()) &&
			(await this.cleanup())
		);
	}
}

class BasicProject extends Project {
	protected transcribe(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected summarise(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected format(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected saveToDB(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected cleanup(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	public output(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

class SlidesProject extends Project {
	private readonly slides: Map<
		number,
		{
			slide: string; // path to img of slide
			timestamp: Timestamp;
			transcript: Transcript | undefined;
			summary: Summary | undefined;
		}
	> = new Map();

	public constructor(
		title: string,
		date: Date,
		lecture: Lecture,
		userId: string | undefined,
		customisation: Customisation | undefined,
		slides: Slides
	) {
		super(title, date, lecture, userId, customisation);

		// TODO: init slides map using slides param
		console.log(slides);
	}

	protected transcribe(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected summarise(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected format(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected saveToDB(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected cleanup(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	public output(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

class HardcodeSlidesProject extends Project {
	protected transcribe(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected summarise(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected format(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected saveToDB(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	protected cleanup(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	public output(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
