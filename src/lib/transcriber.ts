import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { createReadStream } from 'fs';
import { rm } from 'node:fs/promises';
import pkg from 'fluent-ffmpeg';
import { openai } from './openai_clinet';

const { setFfmpegPath } = pkg;

async function extract_audio(filePath: string): Promise<void> {
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
				.addOutputOption('-segment_frames', '10000,20000,30000,40000,50000,65000')
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

export async function transcribe(filePath: string): Promise<string | null> {
	try {
		await extract_audio(filePath);
		// const transcription: Transcription = await get_transcription(filePath);
		// return transcription.text;
		return 'a';
	} catch (error) {
		console.log(error);
		return null;
	} finally {
		await rm(filePath + '.mp3');
	}
}
