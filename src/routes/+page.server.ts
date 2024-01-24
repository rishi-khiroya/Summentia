import type { Actions } from './$types';
import { error } from '@sveltejs/kit';

import { Project } from '$lib/types/Project';

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();

		// const title: string | undefined = form.get('title')?.toString();
		// const date: string | undefined = form.get('date')?.toString();
		const title = "test";
		const date = new Date();

		if (!title || !date) error(400, "Invalid input");
		const project: Project = Project.from(title, new Date(date), form);
		const success = await project.process(true);
		project.log();
		if (success) project.output();
	}

} satisfies Actions;