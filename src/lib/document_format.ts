/*
document format {
    lecture
    1 set of slides
    1 slide image mapping
    1 slide transcript

    - constructor with lecture passed in. init empty imagemapping. init empty slide transcript
}
*/

class document_format{

    // overall lecture
    private lecture: Lecture;

    // set of slides in the lecture
    private slides: Array<Slide>;

    // map of slide numbers to set of extracted images for given slide
    private images: Map<number, Array<String>>;

    // map of slide numbers to set of text sections for a given slide
    private transcripts: Slide_Transcript;

    public constructor(lecture: Lecture){
        this.lecture = lecture;
        this.slides = new Array();
        this.images = new Map();
        this.transcripts = new Slide_Transcript(lecture.title, lecture.date);
    }
}