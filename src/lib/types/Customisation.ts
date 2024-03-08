export interface Customisation {
	highlight_keywords: boolean; // default false
	questions: boolean; // default false
	summary_format: string; // default ""
	length: number; // default 1
}

export const DEFAULT_CUSTOMISATION: Customisation = {
	highlight_keywords: false,
	questions: false,
	summary_format: '',
	length: 1
};
