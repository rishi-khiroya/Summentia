import { summarise } from "$lib/summariser";
import { transcribe } from "$lib/transcriber";
import { Lecture } from "./Lecture";
import type { Summary } from "./Summary";
import type { Transcript } from "./Transcript";

export class Project {

    readonly title: string;
    readonly date: Date;

    // Internal representations at each stage.
    private readonly lecture: Lecture;
    private transcript: Transcript | undefined;
    private summary: Summary | undefined;

    static from(title: string, date: Date, form: FormData): Project {
        return new Project(title, date, Lecture.fromForm(form));
    }

    public constructor(title: string, date: Date, lecture: Lecture) {
        this.title = title;
        this.date = date;
        this.lecture = lecture;
    }

    private async transcribe(): Promise<boolean> {
        const path: string = await this.lecture.toFilePath();
        const extlessPath: string = path.substring(0, path.lastIndexOf('.'));

        const transcript: string | null = await transcribe(extlessPath);
        if (!transcript) return false;

        this.transcript = { text: transcript };
        return true;
    }

    private async summarise(): Promise<boolean> {
        if (!this.transcript) return false;

        const summary: string | null = await summarise(this.transcript?.text);
        if (!summary) return false;

        this.summary = { text: summary };
        return true;
    }

    public async process(withLogs: boolean = false): Promise<boolean> {
        if (withLogs) console.log("Transcribing...");
        if (!await this.transcribe()) return false;
        if (withLogs) console.log("Summarising...");
        if (!await this.summarise()) return false;
        if (withLogs) console.log("Cleaning Up...");
        await this.lecture.cleanup();
        if (withLogs) console.log("Processed.");
        return true;
    }

    public output(): boolean {
        return false;
    }

    public log(): void {
        if (this.transcript) console.log(`Transcript:\n${this.transcript.text}\n`);
        if (this.summary) console.log(`Summary:\n${this.summary.text}\n`);
        return this;
    }
}