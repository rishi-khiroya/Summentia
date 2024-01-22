export abstract class Transcript {
    //title of the lecture
    private title: string;
    //date of lecture
    private date: Date;

    public constructor(title: string, date: Date) {
        this.title = title;
        this.date = date;
    }

    getTitle(): string {
        return this.title;
    }

    getDate(): Date {
        return this.date;
    }

    abstract getText(): string;
}