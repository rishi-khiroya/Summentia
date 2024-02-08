import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { createReadStream } from 'fs';
import { rm } from 'node:fs/promises';
import pkg from 'fluent-ffmpeg';
import { openai } from './openai_clinet';

const { setFfmpegPath } = pkg;

function convertTimestampsToOptions(timestamps: string): [number, string] {
	const json: [] = JSON.parse(timestamps);
	console.log(json);
	const segmentCount: number = json.length;
	const options: string = json.map((timestamp) => timestamp.end).join(',');
	return [segmentCount, options];
}

async function extract_audio(filePath: string, frames: string): Promise<void> {
	if (!ffmpegPath) {
		throw new Error(' cannot be found in ffmpeg-static package');
	} else {
		setFfmpegPath(ffmpegPath);

		await new Promise<void>((resolve, reject) => {
			ffmpeg()
				.input(createReadStream(filePath + '.mp4'))
				.format('mp3')
				.output('%03d.mp3')
				.outputOption('-ab', '96k')
				.addOutputOption('-map', '0')
				.addOutputOption('-f', 'segment')
				.addOutputOption('-segment_start_number', '1')
				.addOutputOption('-segment_frames', frames)
				.on('progress', (progress) => {
					if (progress.percent) {
						console.log(`Processing: ${Math.floor(progress.percent)}% done`);
					}
				})
				.on('end', () => {
					console.log('FFmpeg has finished.');
					resolve();
				})
				.on('error', (error) => {
					console.log(error);
					reject(error);
				})
				.run();
		});
	}
}

async function get_transcription(filePath: string) {
	return await openai.audio.transcriptions.create({
		file: fs.createReadStream(filePath + '.mp3'),
		model: 'whisper-1'
	});
}

export async function transcribe(filePath: string): Promise<string[] | null> {
	try {
		const json =
			'[{ "id": 0, "start": 0, "end": 50000 }, { "id": 1, "start": 50001, "end": 60000 }]';
		const [segmentCount, frames] = convertTimestampsToOptions(json);
		console.log(segmentCount);
		await extract_audio(filePath, frames);
		
		// const transcription: Transcription = await get_transcription(filePath);
		// return transcription.text;
		return ['a', 'b'];
	} catch (error) {
		console.log(error);
		return null;
	} finally {
		await rm('*.mp3');
	}
}
