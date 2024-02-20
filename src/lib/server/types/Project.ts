import type { Prisma } from '@prisma/client';
import type { Customisation } from './Customisation';
import { Lecture } from './Lecture';
import type { Slides } from './Slides';
import type { Summary } from './Summary';
import type { Timestamp } from './Timestamp';
import type { Transcript } from './Transcript';
import type { PrismaProject } from '$lib/types/Prisma';

export abstract class Project {
	// Basic information needed for a project.
	readonly title: string;
	readonly date: Date;
	private readonly video: string;

	// Optional info.
	private readonly userId: string | undefined;
	private readonly customisation: Customisation | undefined;

	public constructor(
		title: string,
		date: Date,
		video: string,
		userId: string | undefined
	) {
		this.title = title;
		this.date = date;
		this.video = video;
		this.userId = userId;
	}

	// static from(form: FormData): Project {
	// 	const lecture = Lecture.fromForm(form);
	// 	const slides = form.get('slides');
	// }

	public static async fromLecture(lecture: Lecture): Promise<Project> {
		const info: { title: string, date: string } = await lecture.getTitleDate();
		if (lecture.slides === 'undefined') {
			return new SlidesProject(info.title, new Date(info.date), lecture.video.path, lecture.userId, lecture.slides);
		} else {
			return new BasicProject(info.title, new Date(info.date), lecture.video.path, lecture.userId);
		}
	}

	protected abstract transcribe(): Promise<boolean>;
	protected abstract summarise(): Promise<boolean>;
	protected abstract format(): Promise<boolean>;
	protected abstract cleanup(): Promise<boolean>;

	public abstract saveToDB(): Promise<PrismaProject>;
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
	public saveToDB(): Promise<PrismaProject> {
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
		video: string,
		userId: string | undefined,
		slides: string
	) {
		super(title, date, video, userId);

		// TODO: split + squash slides
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
	public saveToDB(): Promise<PrismaProject> {
		throw new Error('Method not implemented.');
	}
	protected cleanup(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	public output(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
