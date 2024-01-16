class Slide {
    private slide_no : number;
    //assuming that the screenshot of the slide is a file
    private image: string;
    private startTimeStamp: number;
    private endTimeStamp: number;

    public constructor(slide_no: number, image: string, startTimeStamp: number, endTimeStamp: number){
        this.slide_no = slide_no;
        this.image = image;
        this.startTimeStamp = startTimeStamp;
        this.endTimeStamp = endTimeStamp;
    }
}
class Slide_Transcript {
    //title of the lecture
    private title: String;
    //date of lecture
    private date: Date;
    // map of slide numbers to their corresponding transcript summaries
    private slideSummaries : Map<number, Array<String>>;
    public constructor(title: String, date: Date) {
        this.title = title;
        this.date = date;
        this.slideSummaries = new Map();
    }

    public putSlide(key: number, value: String){
        let transcripts = this.slideSummaries.get(key);
        if (transcripts != undefined){
            transcripts?.push(value);
            this.slideSummaries.set(key, transcripts);
        }
    }

    public getSlide(key: number, value: String){
        let transcripts = this.slideSummaries.get(key);
        return transcripts;
    }

}