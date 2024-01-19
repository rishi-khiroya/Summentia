import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { put } from "@vercel/blob";
// import { writeFile } from 'fs/promises';

import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();
		let lectureURL: URL;

		const uploadToBlob = async (file: File) => {
			console.log(`Uploading ${file.name} to BLOB store.`)
			const { url: urlPath } = await put(file.name, file, { access: "public", token: BLOB_READ_WRITE_TOKEN });

			let url;
			try {
				url = new URL(urlPath);
			} catch (_) {
				error(400, "Error accessing uploaded file.");
			}
			console.log(`Successfully uploaded ${file.name} to BLOB store.`)

			lectureURL = url;
		}	

		const process = async (file: File) => {
			// TODO: implement pipeline
			// const transcript: string = await transcribe(...);
			// const lecture: Lecture = new Lecture(...);
			// const summary: Sumamry = summarise(lecture);
			console.log("process: ", file.name)
			return;
		}

		if (form.get('isLectureFile') === "true") {

			// handle file upload
			const file: File = form.get(`lectureFile`) as File;
			console.log(file);

			// TODO: write file to some temp dir
			// await writeFile(`./files/${file.name}`,new Uint8Array(await  file.arrayBuffer()));		
			// console.log("file written to: ", file.name);	

			if (file) {
				const uploadTask: Promise<void> = uploadToBlob(file);
				const processTask: Promise<void> = process(file);
				
				// wait for async tasks to finish
				Promise.all([uploadTask, processTask]);
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