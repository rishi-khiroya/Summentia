import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { put } from "@vercel/blob";
import { writeFile, rm } from 'node:fs/promises';

import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'
import { transcribe } from '$lib/transcriber';
// import { Lecture } from '$lib/lecture';
import { summarise } from '$lib/summariser';

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();
		let lectureURL: URL;

		const uploadToBlob = async (file: File): Promise<URL> => {
			console.log(`Uploading ${file.name} to BLOB store.`)
			const { url: urlPath } = await put(file.name, file, { access: "public", token: BLOB_READ_WRITE_TOKEN });

			let url;
			try {
				url = new URL(urlPath);
			} catch (_) {
				error(400, "Error accessing uploaded file.");
			}
			console.log(`Successfully uploaded ${file.name} to BLOB store.`)

			return url;
		}

		const process = async (file: File) => {

			const path: string = `static/${file.name}`;
			await writeFile(path, Buffer.from(await file.arrayBuffer()));

			const extlessPath = path.substring(0, path.lastIndexOf('.'));
			const transcript: string | null = await transcribe(extlessPath);
			await rm(path);

			if (!transcript) {
				console.error("Unable to transcribe this lecture.");
				return;
			}

			// const lecture: Lecture = new Lecture(extlessPath, new Date(), transcript); // TODO
			const summary = await summarise(transcript);
			console.log(summary);
		}

		if (form.get('isLectureFile') === "true") {

			// handle file upload
			const file: File = form.get(`lectureFile`) as File;
			// console.log(file);

			if (file) {

				const uploadTask: Promise<URL> = uploadToBlob(file);
				const processTask: Promise<void> = process(file);

				// wait for async tasks to finish
				const completedTasks = await Promise.all([uploadTask, processTask]);
				lectureURL = completedTasks[0];
			}

		} else {
			// TODO: not priorty - stretch goal

			// handle file from url
			const data: string = (form.get('lectureURL') ?? '').toString();

			let url: URL;
			try {
				url = new URL(data);
			} catch (_) {
				error(400, "Invalid URL.")
			}

			lectureURL = url;
			console.log(lectureURL);

			const file: File | null = null;
			if (file) await process(file);

		}

	}
} satisfies Actions;