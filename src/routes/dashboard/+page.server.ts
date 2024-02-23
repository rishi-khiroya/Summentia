import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Project } from '@prisma/client';

const NO_PROJECTS: number = 5;

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');

	const pageNoParam: string = event.url.searchParams.get('page') ?? "0";
	const pageNo: number = pageNoParam ? Number(pageNoParam) : 0;

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
		take: NO_PROJECTS,
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { noProjects, pageNo, projects };
};
