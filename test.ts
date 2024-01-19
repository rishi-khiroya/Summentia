import * as fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

async function extract_audio(filename: string) {
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
}

async function run_query(filename) {
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
    const result = await response.json();
    console.log(result);
}

try {
    const file = "door_tier_list";
    extract_audio(file);
    console.log("EXTRACTION COMPLETE");
    await run_query(file);
} catch (error) {
    console.log(error);
}
