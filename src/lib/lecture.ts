import { Transcript } from "./transcript";
export class Lecture extends Transcript {
    //transcript of lecture
    private text: string;

    public constructor(title: string, date: Date, text: string) {
        super(title, date);
        this.text = text;
    }

    getText(): string {
        return this.text;
    }
}