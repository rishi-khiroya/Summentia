import type { Actions } from './$types';
import { Project } from '$lib/types/Project';
import { error } from '@sveltejs/kit';
import type { Summary } from '$lib/types/Summary';

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();

		// TODO: add title and date info to form
		// const title: string | undefined = form.get('title')?.toString();
		// const date: string | undefined = form.get('date')?.toString();
		const title = 'test';
		const date = new Date();

		if (!title || !date) error(400, 'Invalid input');

		// const project: Project = Project.from(title, new Date(date), form);

		// test code - TODO remove for final implementation
		const fileName: string | undefined = form.get('lectureFile')?.toString();
		if (!fileName) {
			return { success: false, summary: '' };
		}
		const project: Project = Project.fromString(title, new Date(date), fileName);

		const success: boolean = await project.process(true);
		project.log();

		// edit to return only the first summary rn
		return {
			success,
			summary: project
				.output()
				?.map((segment: Summary) => segment.text)
				.join('\n')
		};
	}
} satisfies Actions;
