import type { Actions } from './$types';
import { Project } from '$lib/types/Project';
import { error } from '@sveltejs/kit';

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();

		// TODO: add title and date info to form
		// const title: string | undefined = form.get('title')?.toString();
		// const date: string | undefined = form.get('date')?.toString();
		const title = "test";
		const date = new Date();

		if (!title || !date) error(400, "Invalid input");

		const project: Project = Project.from(title, new Date(date), form);
		const success: boolean = await project.process(true);
		project.log();

		return { success, summary: project.output()?.text };

	}

} satisfies Actions;