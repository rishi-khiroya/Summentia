export interface PrismaUser {
	name: string;
	email: string;
}

export interface PrismaProject {
	title: string;
	userId: number;
	date: Date | undefined;
	videoUrl: string | undefined;
	audioUrl: string | undefined;
	transcript: string | undefined;
	summary: string | undefined;
}
