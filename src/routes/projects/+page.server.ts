import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { Project } from '@prisma/client';

const ITEMS_PER_PAGE: number = 10;

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');

	const pageNoParam: string | null = event.url.searchParams.get('page');
	const pageNo: number = pageNoParam ? Number(pageNoParam) : 0;

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
		skip: pageNo * ITEMS_PER_PAGE,
		take: ITEMS_PER_PAGE,
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { noProjects, pageNo, projects };
};
