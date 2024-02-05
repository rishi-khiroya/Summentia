import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { createReadStream } from 'fs';
import { rm } from 'node:fs/promises';
import pkg from 'fluent-ffmpeg';
import { openai } from './openai_clinet';

const { setFfmpegPath } = pkg;

function extract_audio(
	filePath: string,
	resolve: { (value: void | PromiseLike<void>): void; (): void }
): boolean {
	if (!ffmpegPath) return false;

	try {
		setFfmpegPath(ffmpegPath);
		ffmpeg()
			.input(createReadStream(filePath + '.mp4'))
			.outputOptions('-ab', '96k')
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
				console.error(error);
			})
			.format('mp3')
			.save(filePath + '.mp3');
	} catch (_) {
		return false;
	}

	return true;
}

async function get_transcription(filePath: string) {
	return await openai.audio.transcriptions.create({
		file: fs.createReadStream(filePath + '.mp3'),
		model: 'whisper-1'
	});
}

export async function transcribe(filePath: string): Promise<string | null> {
	try {
		await new Promise<void>((resolve) => {
			extract_audio(filePath, resolve);
		});

		console.log('FFMPEG is done processing.');

		const transcription = await get_transcription(filePath);
		console.log('transcription complete');
		console.log(transcription.text);
		return transcription.text;
	} catch (error) {
		console.log(error);
		return null;
	} finally {
		await rm(filePath + '.mp3');
	}
}
