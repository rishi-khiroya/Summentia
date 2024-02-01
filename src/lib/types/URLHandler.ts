import ytdl from "ytdl-core";
import * as fs from "fs";


export abstract class URLHandler {
    url: URL;
    outputFilePath = 'tmp/video.mp4'
    count: number;

    public constructor(url: URL) {
        this.url = url;
        this.count = 0;
    }

    public abstract download(): Promise<string>;

    static create(url: URL): URLHandler {
        const name = url.hostname.replaceAll('.', '');
        if (name.includes("youtube")) return new YoutubeHandler(url);
        if (name.includes("panopto")) return new PanoptoHandler(url);
        return new UnknownHandler(url);
    }

}

class UnknownHandler extends URLHandler {
    public download(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}

class YoutubeHandler extends URLHandler {
    public async download(): Promise<string> {
        console.log("downloading")
        const urlString = this.url.toString() 
        console.log(urlString)
        const info = await ytdl.getInfo(urlString)
        const options = ytdl.filterFormats(info.formats, 'audioandvideo')
        if (options.length){
            await new Promise(resolve => {ytdl.downloadFromInfo(info, {quality: options[0].itag}).pipe(fs.createWriteStream(this.outputFilePath)).on('close', resolve)})
        }
        // ytdl(urlString).chooseFormat(info.fo).pipe(fs.createWriteStream(this.outputFilePath))
        // await new Promise(resolve => {
        //     ytdl(urlString).pipe(fs.createWriteStream(`tmp/${this.outputFilePath}`)).on('close', resolve)
        // })

        console.log(`out = ${this.outputFilePath}`)
        return this.outputFilePath;
    }
}

class PanoptoHandler extends URLHandler {
    public download(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}