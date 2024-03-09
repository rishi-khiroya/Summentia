import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { removeFromDB } from '$lib/server/types/Project';
import type { Project } from '@prisma/client';

const ITEMS_PER_PAGE: number = 10;

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');

	const pageNoParam: string = event.url.searchParams.get('page') ?? "1";
	let pageNo: number = pageNoParam ? Number(pageNoParam) : 1;
	if (pageNo <= 0) pageNo = 1

	// Load useful data
	const noProjects: number | undefined = (
		await prisma.user.findUnique({
			where: {
				id: session.user.id
			},
			select: {
				projects: true
			}
		})
	)?.projects.length;

	const projects: Project[] = await prisma.project.findMany({
		where: {
			userId: session.user.id
		},
		skip: (pageNo - 1) * ITEMS_PER_PAGE,
		take: ITEMS_PER_PAGE,
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { noProjects, pageNo, projects };
};

export const actions = {
	delete: async ({request}) => {
		const form = await request.formData();
		const id = Number(form.get('id').toString());
		await removeFromDB(id)
		console.log("finished delete")
	}
}