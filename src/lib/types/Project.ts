import { OutputType, output } from "$lib/output_engine";
import { summarise } from "$lib/summariser";
import { transcribe } from "$lib/transcriber";
import { Lecture } from "./Lecture";
import type { Summary } from "./Summary";
import type { Transcript } from "./Transcript";

const MAX_PATH_LENGTH = 16;

export class Project {

    readonly title: string;
    readonly date: Date;

    // Internal representations at each stage.
    private readonly lecture: Lecture;
    private transcripts: Transcript[] | undefined;
    private summaries: Summary[] | undefined;

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

        const transcripts: string[] | null = await transcribe(extlessPath);
        if (!transcripts) return false;

        this.transcripts = transcripts.map((transcript, index) => {
            return { id: index, text: transcript };
        })
        return true;
    }

    private async summarise(): Promise<boolean> {
        if (!this.transcripts) return false;

        const summaries: string[] = []

        for (const transcript of this.transcripts) {
            const summary: string | null = await summarise(transcript.text);
            if (!summary) return false;
            summaries.push(summary);
        }

        this.summaries = summaries.map((summary, index) => {
            return {id: index, text: summary};
        })
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

    public log(): void {
        if (this.transcripts) this.transcripts?.map((t) => {
            console.log(`Transcript ${t.id}:\n${t.text}\n`);
        })
        if (this.summaries) this.summaries?.map((s) => {
            console.log(`Summary ${s.id}:\n${s.text}\n`);
        })
    }

    public output(): Summary[] | undefined {

        // const sanitiseFileName = (title: string) => {
        //     let fileName: string = title.substring(0, MAX_PATH_LENGTH); // take first MAX_PATH_LENGTH chars
        //     fileName = fileName.replace(/ /g, "_"); // replaces whitespace with underscores
        //     fileName = fileName.replace(/[^a-zA-Z0-9]/g, ""); // remove all non-alphanumeric chars
        //     return fileName;
        // }

        // if (!this.summary) return false;

        // output(this.summary.text, sanitiseFileName(this.title), OutputType.TEX);
        // return true;
        return this.summaries;
    }
}