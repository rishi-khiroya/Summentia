export abstract class VideoURLHandler {
	url: URL;

	public constructor(url: URL) {
		this.url = url;
	}

	public abstract download(): File;

	static create(url: URL): VideoURLHandler {
		const name = url.hostname.replaceAll('.', '');

		if (name.includes('youtube')) return new YoutubeHandler(url);
		if (name.includes('panopto')) return new PanoptoHandler(url);
		return new UnknownHandler(url);
	}

	public abstract getTitleDate(): Promise<{ title: string; date: string }>;

}

class UnknownHandler extends VideoURLHandler {
	public getTitleDate(): Promise<{ title: string; date: string; }> {
		throw new Error("Method not implemented.");
	}
	public download(): File {
		throw new Error('Method not implemented.');
	}
}

class YoutubeHandler extends VideoURLHandler {
	public getTitleDate(): Promise<{ title: string; date: string; }> {
		throw new Error("Method not implemented.");
	}
	public download(): File {
		throw new Error('Method not implemented.');
	}
}

class PanoptoHandler extends VideoURLHandler {
	public getTitleDate(): Promise<{ title: string; date: string; }> {
		throw new Error("Method not implemented.");
	}
	public download(): File {
		throw new Error('Method not implemented.');
	}
}
