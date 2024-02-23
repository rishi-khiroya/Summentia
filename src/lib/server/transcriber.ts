import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { createReadStream } from 'fs';
import { rm } from 'node:fs/promises';
import pkg from 'fluent-ffmpeg';
import { openai } from './openai_clinet';
import type { Transcription } from 'openai/resources/audio/transcriptions.mjs';
import path from 'path';

const { setFfmpegPath } = pkg;

async function get_transcription(filePath: string) {
	return await openai.audio.transcriptions.create({
		file: fs.createReadStream(filePath + '.mp3'),
		model: 'whisper-1'
	});
}

async function extract_audio(filePath: string): Promise<void> {
	if (!ffmpegPath) throw new Error(' cannot be found in ffmpeg-static package');

	setFfmpegPath(ffmpegPath);

	await new Promise<void>((resolve, reject) => {
		ffmpeg()
			.input(createReadStream(filePath + '.mp4'))
			.outputOptions('-ab', '192k')
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
				console.log('Error occurred with FFmpeg.');
				reject(error);
			})
			.format('mp3')
			.save(filePath + '.mp3');
	})
}

export async function transcribe(filePath: string): Promise<string | null> {
	try {
		await extract_audio(filePath);
		const transcript = await get_transcription(filePath);
		return transcript.text;
	} catch (error) {
		console.log(error);
		return null;
	} finally {
		await rm(filePath + '.mp3');
	}
}


function convertTimestampsToOptions(timestamps: object[]): [number, string] {
	const segmentCount: number = timestamps.length;
	const options: string = timestamps.map((timestamp) => timestamp.end).join(',');
	return [segmentCount, options];
}

async function split_extract_audio(filePath: string, frames: string): Promise<void> {
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
					console.log('Error occurred with FFmpeg.');
					reject(error);
				})
				.run();
		});
	}
}

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function split_transcribe(filePath: string, timestamps: object[]): Promise<string[] | null> {
	try {
		const [segmentCount, frames] = convertTimestampsToOptions(timestamps);
		await split_extract_audio(filePath, frames);

		const transcripts: string[] = [];
		for (let segment = 1; segment <= segmentCount; segment++) {
			await delay(30000);
			const fileName = ('000' + segment).slice(-3);
			const transcription: Transcription = await get_transcription(fileName);
			transcripts.push(transcription.text);
		}
		return transcripts;
	} catch (error) {
		console.log(error);
		return null;
	} finally {
		fs.readdir('./', (err, files) => {
			if (err) {
				console.log(err);
			}

			files.forEach((file) => {
				const fileDir = path.join('./', file);
				if (path.extname(file).toLowerCase() == '.mp3') {
					fs.unlinkSync(fileDir);
				}
			});
		});
	}
}
