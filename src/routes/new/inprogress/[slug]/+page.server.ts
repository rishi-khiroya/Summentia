import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PrismaProjectStatus, type PrismaProject } from "$lib/types/Prisma";

export const load: PageServerLoad = async ({ params }) => {

    const data = await prisma.project.findUnique({
        where: {
            id: Number(params.slug)
        }
    });

    if (!data || !data.video || !data.data) error(503, "Project not found.");

    console.log(data.data);

    const project: PrismaProject = {
        id: data.id,
        title: data.title,
        userId: data.userId,
        date: data.date,
        createdAt: data.createdAt,
        hasSlides: data.hasSlides,
        video: data.video, // path of the video on the vm
        slides: "", // data.slides
        data: JSON.parse(JSON.stringify(data.data)),
        // @ts-expect-error Unsafe enum use
        status: PrismaProjectStatus[data.status],
        waiting: data.waiting,
    }

    console.log(project);
    return { project };

}