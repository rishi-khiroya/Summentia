class Transcript {
    //title of the lecture
    private title: String;
    //date of lecture
    private date: Date;
    //transcript of lecture
    private text: String;

    public constructor(title: String, date: Date, text: String) {
        this.title = title;
        this.date = date;
        this.text = text;
    }
}