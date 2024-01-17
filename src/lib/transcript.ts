abstract class Transcript {
    //title of the lecture
    private title: String;
    //date of lecture
    private date: Date;

    public constructor(title: String, date: Date){
        this.title = title;
        this.date = date;
    }

    getTitle(): String {
        return this.title;
    }

    getDate(): Date {
        return this.date;
    }

    abstract getText(): String;
}