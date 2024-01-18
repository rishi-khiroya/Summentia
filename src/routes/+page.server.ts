import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { put } from "@vercel/blob";

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();
		// const form = Object.fromEntries(await request.formData());

		console.log(form);
		// console.log(formData);

		let lectureURL: URL;

		if (form.get('isLectureFile') === "true") {

			// handle file upload
			const urls: URL[] = [];
			const noFiles: number = parseInt((form.get('noLectureFiles') ?? '0').toString());

			if (noFiles != 1) console.warn(`${noFiles} lecture files have been uploaded. This could be a mistake.`);

			for (let i = 0; i < noFiles; i++) {
				const file: File = form.get(`lectureFile${i}`) as File;
				if (file) {
					console.log(file);
					const { url: urlPath } = await put(file.name, file, { access: "public" });

					let url;
					try {
						url = new URL(urlPath);
						urls
					} catch (_) {
						error(400, "Error accessing uploaded file.");
					}

					urls.push(url);
				}
			}

			if (urls.length != 1) console.warn(`${urls.length} lecture files have been uploaded succesfully to BLOB. There should only have been 1. Continuing using the first URL (${urls[0]})`);

			lectureURL = urls[0];

		} else {

			// handle file from url
			const data: string = (form.get('lectureURL') ?? '').toString();

			let url: URL;
			try {
				url = new URL(data);
			} catch (_) {
				error(400, "Invalid URL.")
			}

			console.log(url.hostname);
			lectureURL = url;

		}

		console.log(`Final lectureURL=${lectureURL}`);

	}
} satisfies Actions;