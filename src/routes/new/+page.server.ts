import type { Session } from '@auth/core/types';
import type { PageServerLoad } from './$types';
import { Lecture } from '$lib/server/types/Lecture';
import { Project } from '$lib/server/types/Project';
import type { PrismaProject } from '$lib/types/Prisma';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	return { session };
};

export const actions = {
	extractInfo: async ({ request }) => {
		const form = await request.formData();

		try {
			// TODO: verify lecture exists
			const lecture: Lecture = Lecture.fromLectureForm(form);
			// TODO: Put lecture in db
			return { success: true, lecture: await lecture.toJSON() };
		} catch (e) {
			// console.log(e);
			return { success: false, error: JSON.stringify(e) };
		}
	},

	addSlides: async ({ request }) => {
		const form = await request.formData();

		const data = form.get('lecture')?.toString();
		if (!data) return { success: false, error: "Invalid Form: No lecture found." }

		const lecture: Lecture = Lecture.fromJSON(data);
		if (form.get('slidesFromFile') === 'true') {
			lecture.withSlidesFromFile(form.get(`slidesFile`) as File);
		} else {
			const url = form.get('lectureURL');
			if (!url) return { success: false, error: "Invalid Form: No url provided for slides." }
			lecture.withSlidesFromURL(url.toString());
		}

		// TODO: update db

		return { success: true, lecture: lecture.toJSON() };

	},

	submit: async ({ request }) => {
		const form = await request.formData();

		const data = form.get('lecture')?.toString();
		if (!data) return { success: false, error: "Invalid Form: No lecture found." }

		const lecture: Lecture = Lecture.fromJSON(data);
		const project: Project = await Project.fromLecture(lecture);

		console.log(project);
		let record: PrismaProject | undefined = undefined;
		while (!record) {
			record = await project.saveToDB();
			await new Promise((resolve) => {
				setTimeout(resolve, 1000);
			});
		};
		// TODO: PUSH TO DB and return project id

		return { success: true, projectId: record.id };
	}
};
