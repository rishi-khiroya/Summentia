export abstract class URLHandler {
	url: URL;

	public constructor(url: URL) {
		this.url = url;
	}

	public abstract download(): File;

	static create(url: URL): URLHandler {
		const name = url.hostname.replaceAll('.', '');

		if (name.includes('youtube')) return new YoutubeHandler(url);
		if (name.includes('panopto')) return new PanoptoHandler(url);
		return new UnknownHandler(url);
	}
}

class UnknownHandler extends URLHandler {
	public download(): File {
		throw new Error('Method not implemented.');
	}
}

class YoutubeHandler extends URLHandler {
	public download(): File {
		throw new Error('Method not implemented.');
	}
}

class PanoptoHandler extends URLHandler {
	public download(): File {
		throw new Error('Method not implemented.');
	}
}
