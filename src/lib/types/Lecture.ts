import { rm, writeFile } from "node:fs/promises";
import type { SupplementaryInfo } from "./SupplementaryInfo";
import { URLHandler } from "./URLHandler";

// TODO: complete definition
export abstract class Lecture {

    path: string;
    public supplementaryInfo: SupplementaryInfo | undefined;

    public constructor(fileName: string) {
        this.path = `static/${fileName}`;
    }

    public abstract toFilePath(): Promise<string>;
    public abstract saveToUrl(): URL;

    public async cleanup(): Promise<void> {
        await rm(this.path);
    }

    static fromForm(form: FormData): Lecture {
        if (form.get('isLectureFile') === "true") {
            return new LectureFromFile(form.get(`lectureFile`) as File);
        } else {
            const data = form.get('lectureURL');
            if (!data) throw new Error("Invalid URL");
            return new LectureFromUrl(new URL(data.toString()));
        }
    }

    static fromFile(file: File): Lecture {
        return new LectureFromFile(file);
    }

    static fromString(fileName: string): Lecture {
        return new TestLecture(fileName);
    }

}

class TestLecture extends Lecture {

    public constructor(fileName: string) {
        super(fileName);
    }

    public async toFilePath(): Promise<string> {
        return this.path;
    }

    public saveToUrl(): URL {
        throw new Error("Method not implemented.");
    }

}

class LectureFromFile extends Lecture {

    private readonly file: File;

    public constructor(file: File) {
        super(file.name);
        this.file = file;
    }

    public async toFilePath(): Promise<string> {
        await writeFile(this.path, Buffer.from(await this.file.arrayBuffer()));
        return this.path;
    }

    public saveToUrl(): URL {
        throw new Error("Method not implemented.");
    }
}

// TODO: check if can be combined with URLHandler
class LectureFromUrl extends Lecture {

    private urlHandler: URLHandler;

    public constructor(url: URL) {
        super(`temp${url.origin}`); // TODO
        this.urlHandler = URLHandler.create(url);
    }

    public async toFilePath(): Promise<string> {
        this.urlHandler.download();
        return this.path;
    }

    public saveToUrl(): URL {
        throw new Error("Method not implemented.");
    }

}