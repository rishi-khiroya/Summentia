import { Project } from '$lib/types/Project';
import { error, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@auth/core/types';

export const actions = {
	submit: async ({ request }) => {
		const form = await request.formData();

		// TODO: add title and date info to form
		// const title: string | undefined = form.get('title')?.toString();
		// const date: string | undefined = form.get('date')?.toString();
		const title = 'test';
		const date = new Date();

		if (!title || !date) error(400, 'Invalid input');

		const project: Project = Project.from(title, new Date(date), form);
		const success: boolean = await project.process(true);
		project.log();

		return { success, summary: project.output()?.text };
	}
} satisfies Actions;

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');
	return {};
}