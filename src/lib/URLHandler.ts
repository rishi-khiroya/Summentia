export abstract class URLHandler {

    url: URL;

    constructor(url: URL) {
        this.url = url;
    }

    abstract process(): boolean;

    static create(url: URL): URLHandler {
        const name = url.hostname.replaceAll('.', '');

        if (name.includes("youtube")) return new YoutubeHandler(url);
        if (name.includes("panopto")) return new PanoptoHandler(url);
        return new UnknownHandler(url);
    }

}

class UnknownHandler extends URLHandler {
    process(): boolean {
        return false;
    }
}

class YoutubeHandler extends URLHandler {
    process(): boolean {
        throw new Error("Method not implemented."); // TODO
    }
}

class PanoptoHandler extends URLHandler {
    process(): boolean {
        throw new Error("Method not implemented."); // TODO
    }
}