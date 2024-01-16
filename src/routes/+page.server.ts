import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();
		// const form = Object.fromEntries(await request.formData());

		console.log(form);
		// console.log(formData);

		let lecture: File;

		if (form.get('isLectureFile') === "true") {

			// handle file upload
			let files: File[] = [];

			const noFiles: number = parseInt((form.get('noLectureFiles') ?? '0').toString());
			for (let i = 0; i < noFiles; i++) {
				let file = form.get(`lectureFile${i}`);
				if (!!file) files.push(file as File);
			}

			if (files.length) lecture = files[0];

		} else {

			// handle file from url
			const data: string = (form.get('lectureURL') ?? '').toString();

			let url: URL;
			try {
				url = new URL(data);
			} catch (exception) {
				error(400, "Invalid URL.")
			}

		}
	}
} satisfies Actions;