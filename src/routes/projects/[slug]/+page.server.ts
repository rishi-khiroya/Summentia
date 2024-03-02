import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../../$types';
import { redirect, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Project } from '@prisma/client'
import { addToTemplate, getBodyLatexCode } from '$lib/server/latex_generation';
import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/Prisma';
import { OutputType, output } from '$lib/server/output_engine';
import { PATH_TO_DATA } from '$env/static/private';
import { unlinkSync } from 'fs';
import { upload } from '$lib/object_storage/upload';
import { DIGITAL_OCEAN_SUMMARIES_FOLDER } from '$lib/object_storage/static';

export const load: PageServerLoad = async (event) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) throw redirect(303, "/");

    const pageNoParam: string = event.url.searchParams.get('page') ?? "1";
	let pageNo: number = pageNoParam ? Number(pageNoParam) : 1;
	if (pageNo <= 0) pageNo = 1;

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

export const actions = {
    download: async ({ request, params, locals }) => {
        
        const form = await request.formData();

        const type = form.get('type')?.toString();
        const outputType: OutputType = OutputType[type.toUpperCase()]

        const filename = form.get('filename')?.toString();
        let latexCode = "";

        if (!type) error(400, "Invalid form data.");

        const session: Session | null = await locals.auth();
        const userId: string | undefined = session?.user.id;

        const data = await prisma.project.findUnique({
            where: {
                id: Number(params.slug)
            }
        });

        if (!data) error(503, "No project found");
        if (data.userId != userId) redirect(303, `/dashboard`);

        if (data.hasSlides) {
            const slidesData = (JSON.parse(JSON.stringify(data.data)) as PrismaSlidesData[]);
            const slides:string[] = [];
            slidesData.forEach(slideData => {slides.push(slideData.slide)});
            const summaries:string[] = [];
            slidesData.forEach(slideData => {summaries.push(slideData.summary)});
            const latexBody = getBodyLatexCode(slides, summaries);
            latexCode = addToTemplate(data.title, session?.user.name??"", latexBody);

        } else {
            latexCode = addToTemplate(data.title, session?.user.name??"", (JSON.parse(JSON.stringify(data.data)) as PrismaBasicData).summary);
        }
        const path = `${PATH_TO_DATA}/${filename}.${type}`;
        await output(latexCode, `${PATH_TO_DATA}/${filename}`, outputType);
        await upload(path, `${DIGITAL_OCEAN_SUMMARIES_FOLDER}/${filename}.${type}`);
        // has to sleep as the link does not become available to use immediately
        await new Promise(resolve => setTimeout(resolve, 500));
        unlinkSync(path);
        return true
    }
}