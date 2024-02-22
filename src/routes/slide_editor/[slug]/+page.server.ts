import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { PrismaProjectStatus, type PrismaProject } from "$lib/types/Prisma";

export const load: PageServerLoad = async ({ params }) => {

    const data = await prisma.project.findUnique({
        where: {
            id: Number(params.slug)
        }
    });

    //if (!data || !data.video || !data.data) error(503, "Project not found.");

    console.log(data.data);

    return { data: JSON.parse(JSON.stringify(data.data)), id: data.id, hasSlides: data.hasSlides, };

}
