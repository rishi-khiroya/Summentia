import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PrismaProjectStatus, type PrismaProject, type PrismaSlidesData, type PrismaBasicData } from "$lib/types/Prisma";
import { summarise } from "$lib/server/summariser";
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {

    const data = await prisma.project.findUnique({
        where: {
            id: Number(params.slug)
        }
    });

    if (!data) error(503, "Project not found.");

    if (!data.waiting) {
        if (data.status == 'COMPLETED') {
            redirect(302, `/projects/${data.id}`);
        } else if (data.status == 'SUMMARISED') {
            redirect(302, `/edit/${data.id}`);
        }
    }

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
        status: PrismaProjectStatus[data.status],
        waiting: data.waiting,
    }


    if (project.status == PrismaProjectStatus.TRANSCRIBED) {
        console.log("Starting summarisation.");

        await prisma.project.update({
            where: { id: project.id },
            data: {
                waiting: false
            }
        })

        let data;
        if (project.hasSlides) {
            const slidesData: PrismaSlidesData[] = project.data as PrismaSlidesData[];
            slidesData.forEach(async slideData => {
                const summary: string | null = await summarise(slideData.transcript);
                slideData.summary = summary ? summary : "Error...";
            })
            data = slidesData.map(data => JSON.stringify(data));
        } else {
            const basicData: PrismaBasicData = project.data as PrismaBasicData;
            const summary: string | null = await summarise(basicData.transcript);
            basicData.transcript = summary ? summary : "Error...";
            data = JSON.stringify(basicData);
        }

        await prisma.project.update({
            where: { id: project.id },
            data: {
                data,
                waiting: false,
                status: 'SUMMARISED'
            }
        })
    }

    console.log(project);
    return { project };

}