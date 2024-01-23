import type { Lecture } from "./Lecture";
import type { Summary } from "./Summary";
import type { Transcript } from "./Transcript";

export class Project {

    readonly title: string;
    readonly date: Date;

    // Internal representations at each stage.
    private lecture: Lecture | undefined;
    private transcript: Transcript | undefined;
    private summary: Summary | undefined;

    public constructor(title: string, date: Date) {
        this.title = title;
        this.date = date;
    }

    private transcribe(): boolean {
        return false;
    }

    private summarise(): boolean {
        return false;
    }

    public process(): Project {
        this.transcribe();
        this.summarise();
        return this;
    }

    public output(): boolean {
        return false;
    }

}