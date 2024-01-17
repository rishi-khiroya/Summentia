import * as fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Stream } from 'stream';

async function extract_audio() {
    let data;

    const outStream = new Stream.Writable({
        write(chunk, encoding, next) {
            // console.log(chunk.toString())
            next()
        }
    });

    const inStream = new Stream.Readable({
        read() {}
    });

    ffmpeg.setFfmpegPath(ffmpegStatic);

    ffmpeg()
        .input("./src/static/door_tier_list.mp4")
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
        .format('wav')
        .save("./src/static/door_tier_list.wav")
        // .stream(outStream);

    inStream.pipe(outStream);
    inStream.on('data', (d) => {
        data = d;
    })
    return data;
}
async function query(filename) {
	const data = fs.readFileSync(filename);
	const response = await fetch(
		"https://api-inference.huggingface.co/models/openai/whisper-large-v3",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: data,
		}
	);
	const result = await response.json();
	return result;
}

try {
    await extract_audio();
    query("sample1.flac").then((response) => {
        console.log(JSON.stringify(response));
    });
} catch (error) {
    console.log(error);
}