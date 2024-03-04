export type Slides = {
	noSlides: number;
	slides: {
		path: string; // path to slide img
		squashed: boolean;
	}[];
	file: File;
};