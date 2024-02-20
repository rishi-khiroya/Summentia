import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../../$types';
import { redirect, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Project } from '@prisma/client'

export const load: PageServerLoad = async (event) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) throw redirect(303, "/");

    const pageNoParam: string | null = event.url.searchParams.get('page');
    const pageNo: number = pageNoParam ? Number(pageNoParam) : 0;

    const slug = event.params.slug;

    if (isNaN(Number(slug))) error(404, "Error: Project not found.");

    const project: Project | null = await prisma.project.findUnique({
        where: {
            id: Number(slug)
        }
    });

    if (project == null) error(503, "Unable to fetch project details. Please try again later.");

    return { pageNo, project }
};