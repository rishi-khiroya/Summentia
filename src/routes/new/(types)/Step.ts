export interface Step {
	id: number;
	name: string;
	required: boolean;
	populated: boolean;
	status: StepStatus;
}

export enum StepStatus {
	COMPLETED,
	SKIPPED,
	UNSEEN
}
