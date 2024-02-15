import type { Session } from '@auth/core/types';
import type { PageServerLoad } from './$types';
import { Lecture } from '$lib/types/Lecture';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	return { session };
};

export const actions = {
	extractInfo: async ({ request }) => {
		const form = await request.formData();

		try {
			const lecture: Lecture = Lecture.fromForm(form);
			const info: { title: string; date: string } = await lecture.getTitleDate();
			return {
				success: true,
				info
				// info: {
				// 	title: 'Test',
				// 	date: '2023-10-12'
				// }
			};
		} catch (e) {
			return { success: false, error: JSON.stringify(e) };
		}
	}
};
