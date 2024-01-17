export class Lecture extends Transcript {
    //transcript of lecture
    private text: String;

    public constructor(title: String, date: Date, text: String) {
        super(title, date);
        this.text = text;
    }

    getText(): String {
        return this.text;
    }
}