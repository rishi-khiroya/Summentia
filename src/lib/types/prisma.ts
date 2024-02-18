export interface PrismaUser {
	id: string;
	name: string;
	email: string;
}

export interface PrismaProject {
	title: string;
	userId: number;
	date: string;
	createdAt: string;
	hasSlides: boolean;
	video: string; // path of the video on the vm
	data: PrismaBasicData | PrismaSlidesData[];
	status: PrismaProjectStatus;
	waiting: boolean;
}

export interface PrismaSlidesData {
	slide: string; // path of the slide (as an img) on the vm
	transcript: string;
	summary: string;
}

export interface PrismaBasicData {
	transcript: string;
	summary: string;
}

export enum PrismaProjectStatus {
	UNPROCESSED,
	SPLIT,
	TRANSCRIBED,
	SUMMARISED,
	OUTPUT,
	COMPLETED
}