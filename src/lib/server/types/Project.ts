import { assert } from 'console';
import prisma from '../prisma';

export abstract class Project {
	// Basic information needed for a project.
	readonly title: string;
	readonly date: Date;
	readonly video: string;
	readonly uuid: string;

	// Optional info.
	readonly userId: string | undefined;
	readonly customisation: {
		highlight_keywords: boolean; // default false
		questions: boolean; // default false
		summary_format: string; // default ""
		length: number; // default 1
	};

	public constructor(
		title: string,
		date: Date,
		video: string,
		userId: string | undefined,
		uuid: string,
		customisation: {
			highlight_keywords: boolean; // default false
			questions: boolean; // default false
			summary_format: string; // default ""
			length: number; // default 1
		}
	) {
		this.title = title;
		this.date = date;
		this.video = video;
		this.userId = userId;
		this.uuid = uuid;
		this.customisation = customisation;
	}

	public static async from(
		data: {
			video: string;
			slides: string;
			userId: string;
			uuid: string;
			info: { title: string; date: string };
			customisation: { summaryLevel: number; questions: boolean };
		},
		genSlides: boolean
	): Promise<Project> {
		return genSlides || data.slides
			? new SlidesProject(
					data.info.title,
					new Date(data.info.date),
					data.video,
					data.userId,
					data.uuid,
					data.customisation,
					data.slides
				)
			: new BasicProject(
					data.info.title,
					new Date(data.info.date),
					data.video,
					data.userId,
					data.uuid,
					data.customisation
				);
	}

	public abstract saveToDB(hasSlides: boolean): Promise<number>;
}

class BasicProject extends Project {
	public async saveToDB(genSlides: boolean): Promise<number> {
		assert(!genSlides);
		const record = await prisma.project.create({
			data: {
				title: this.title,
				date: this.date,
				userId: this.userId,
				uuid: this.uuid,
				video: this.video,
				status: 'SPLIT',
				hasSlides: false,
				customisation: this.customisation
			}
		});
		return record.id;
	}
}

class SlidesProject extends Project {
	readonly slides: string;

	public constructor(
		title: string,
		date: Date,
		video: string,
		userId: string | undefined,
		uuid: string,
		customisation: { summaryLevel: number; questions: boolean },
		slides: string
	) {
		super(title, date, video, userId, uuid, customisation);
		this.slides = slides;
	}

	public async saveToDB(genSlides: boolean): Promise<number> {
		console.log(`hasSlides=${genSlides}`);
		const record = await prisma.project.create({
			data: {
				title: this.title,
				date: this.date,
				userId: this.userId,
				uuid: this.uuid,
				video: this.video,
				slides: this.slides,
				hasSlides: !genSlides,
				status: 'UNPROCESSED',
				customisation: this.customisation
			}
		});
		return record.id;
	}
}
