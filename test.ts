import * as fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
// import { Stream } from 'stream';
// import * as https from 'node:https';

async function extract_audio(filename: string) {
    // let data;

    // const outStream = new Stream.Writable({
    //     write(chunk, encoding, next) {
    //         // console.log(chunk.toString())
    //         next()
    //     }
    // });

    // const inStream = new Stream.Readable({
    //     read() {}
    // });

    ffmpeg.setFfmpegPath(ffmpegStatic);

    ffmpeg()
        .input("./src/static/" + filename + ".mp4")
        .outputOptions('-ab', '192k')
        .on('progress', (progress) => {
            if (progress.percent) {
                console.log(`Processing: ${Math.floor(progress.percent)}% done`);
            }
        })
        .on('end', () => {
            console.log('FFmpeg has finished.');
        })
        .on('error', (error) => {
            console.error(error);
        })
        .format('mp3')
        .save("./src/static/" + filename + ".mp3")
        // .stream(outStream);

    // inStream.pipe(outStream);
    // inStream.on('data', (d) => {
    //     data = d;
    // })
    // return data;
}

// const testVid: string = "https://y7ceexhkahxpnqji.public.blob.vercel-storage.com/test.mp4";
// const url: URL = new URL(testVid);

async function run_query(filename) {
    // let data;
    // https.get(filename, (res) => {
    //     res.on('data', (d) => {
    //         // console.log(data);
    //         // console.log(JSON.parse(JSON.stringify(d)));
    //         // data = JSON.parse(JSON.stringify(d))['data'];
    //     });
    // });

    const data = fs.readFileSync("./src/static/" + filename + ".mp3");
    console.log(data);
    const response = await fetch(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: data,
        }
    );
    // console.log(response);
    const result = await response.json();
    console.log(result);
    // return result;
}

try {
    // TODO: extract name so simpler
    const file = "door_tier_list";
    extract_audio(file);
    console.log("EXTRACTION COMPLETE");
    await run_query(file);
} catch (error) {
    console.log(error);
}
