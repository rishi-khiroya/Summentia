import type { SupplementaryInfo } from "./SupplementaryInfo";
import { URLHandler } from "./URLHandler";

// TODO: complete definition
export abstract class Lecture {

    supplementaryInfo: SupplementaryInfo | undefined;

    // TODO: correctly type these
    public abstract toStream(): void;
    public abstract guessTitleDate(): void;

}

class LectureFromFile extends Lecture {

    private file: File;

    public constructor(file: File) {
        super();
        this.file = file;
    }

    public toStream() {
        throw new Error("Method not implemented.");
    }
}

// TODO: check if can be combined with URLHandler
class LectureFromUrl extends Lecture {

    private urlHandler: URLHandler;

    public constructor(url: URL) {
        super();
        this.urlHandler = URLHandler.create(url);
    }

    public toStream() {
        return this.urlHandler.toStream();
    }

}