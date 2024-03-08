import { PATH_TO_DATA } from '$env/static/private';
import { formatDate } from '$lib/utils';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import ytdl from 'ytdl-core';

export abstract class VideoURLHandler {
	url: URL;

	public constructor(url: URL) {
		this.url = url;
	}

	public abstract download(uuid: string): Promise<void>;

	static create(url: URL): VideoURLHandler {
		const name = url.hostname.replaceAll('.', '');

		if (name.includes('youtube')) return new YoutubeHandler(url);
		return new UnknownHandler(url);
	}

	public abstract getTitleDate(): Promise<{ title: string; date: string }>;
}

class UnknownHandler extends VideoURLHandler {
	public async getTitleDate(): Promise<{ title: string; date: string }> {
		const info = await ytdl.getInfo(this.url.toString());
		const title = info['player_response']['videoDetails']['title']
		const date = formatDate(new Date(info['videoDetails']['publishDate']))
		return {title, date}
	}

	public download(uuid: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

class YoutubeHandler extends VideoURLHandler {
	public getTitleDate(): Promise<{ title: string; date: string }> {
		throw new Error('Method not implemented.');
	}
	public async download(uuid: string): Promise<void> {
		const info = await ytdl.getInfo(this.url.toString());
		const options = ytdl.filterFormats(info.formats, 'audioandvideo');
		if (options.length) {
			await new Promise((resolve) => {
				ytdl
					.downloadFromInfo(info, { quality: options[0].itag })
					.pipe(createWriteStream(`${path.join(PATH_TO_DATA, uuid, 'video.mp4')}`))
					.on('close', resolve);
			});
		}
	}
}
