class document_format{

    // overall lecture
    private lecture: Lecture;

    // set of slides in the lecture
    private slides: Array<Slide>;

    // map of slide numbers to set of extracted images for given slide
    private images: Map<number, Array<String>>;

    // map of slide numbers to set of text sections for a given slide
    private transcripts: Slide_Transcript;

    public constructor(lecture: Lecture, slides: Array<Slide>){
        this.lecture = lecture;
        this.slides = slides;
        this.images = new Map();
        this.transcripts = new Slide_Transcript(lecture.title, lecture.date);
    }

    // using IR implementationf for transcripts
    public addTextToSlide(key: number, value: String){
        this.transcripts.putSlide(key, value);
    }

    // following logic for transcripts
    public addImageToSlide(key: number, img: String){
        let imagesForThisSlide = this.images.get(key);
        if (imagesForThisSlide != undefined){
            imagesForThisSlide?.push(value);
            this.images.set(key, img);
        }
    }
}