import type { Session } from '@auth/core/types';
import type { PageServerLoad } from './$types';
import { Lecture } from '$lib/server/types/Lecture';
import { Project } from '$lib/server/types/Project';
import { handshake } from '$lib/server/python';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();

	const backStatus: boolean = await handshake();

	return { session, backStatus };
};

export const actions = {
	extractInfo: async ({ request }) => {
		const form = await request.formData();

		try {
			// TODO: verify lecture exists
			const lecture: Lecture = await Lecture.fromLectureForm(form);
			// TODO: Put lecture in db
			return { success: true, lecture: await lecture.toJSON() };
		} catch (e) {
			return { success: false, error: JSON.stringify(e.message) };
		}
	},

	addSlides: async ({ request }) => {
		const form = await request.formData();

		const data = form.get('lecture')?.toString();
		if (!data) return { success: false, error: 'Invalid Form: No lecture found.' };

		const lecture: Lecture = Lecture.fromJSON(data);
		if (form.get('slidesFromFile') === 'true') {
			await lecture.withSlidesFromFile(form.get(`slidesFile`) as File);
		} else {
			const url = form.get('lectureURL');
			if (!url) return { success: false, error: 'Invalid Form: No url provided for slides.' };
			lecture.withSlidesFromURL(url.toString());
		}

		// TODO: update db

		return { success: true, lecture: await lecture.toJSON() };
	},

	submit: async ({ request }) => {
		const form = await request.formData();

		const data = form.get('lecture')?.toString();
		if (!data) return { success: false, error: 'Invalid Form: No lecture found.' };

		const genSlides = form.get('genSlides') === 'true';

		const project: Project = await Project.from(JSON.parse(data), genSlides);

		console.log(`genSlides=${genSlides}`);

		// console.log(project);
		const id: number | undefined = await project.saveToDB(genSlides);

		// redirect(303, `/new/inprogess/${id}`);
		return { success: true, projectId: id };
	}
};
