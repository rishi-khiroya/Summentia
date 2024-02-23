import { prisma } from '../prisma';

export abstract class Project {
	// Basic information needed for a project.
	readonly title: string;
	readonly date: Date;
	readonly video: string;

	// Optional info.
	readonly userId: string | undefined;

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

	public static async from(data: {
		video: string,
		slides: string,
		userId: string,
		info: { title: string; date: string }
	}): Promise<Project> {
		return data.slides ?
			new SlidesProject(data.info.title, new Date(data.info.date), data.video, data.userId, data.slides) :
			new BasicProject(data.info.title, new Date(data.info.date), data.video, data.userId);
	}

	public abstract saveToDB(): Promise<number>;
}

class BasicProject extends Project {
	public async saveToDB(): Promise<number> {
		const record = await prisma.project.create({
			data: {
				title: this.title,
				date: this.date,
				userId: this.userId,
				video: this.video,
				status: 'SPLIT'
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
		slides: string
	) {
		super(title, date, video, userId);
		this.slides = slides;
	}

	public async saveToDB(): Promise<number> {
		const record = await prisma.project.create({
			data: {
				title: this.title,
				date: this.date,
				userId: this.userId,
				video: this.video,
				slides: this.slides,
				hasSlides: true,
				status: 'UNPROCESSED'
			}
		});
		return record.id;
	}
}
