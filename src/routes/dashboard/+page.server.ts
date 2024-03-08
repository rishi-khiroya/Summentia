import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Project } from '@prisma/client';
import { OutputType, output } from '$lib/server/output_engine';
import { addToTemplate, getBodyLatexCode } from '$lib/server/latex_generation';
import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/prisma';
import path from 'path';
import { PATH_TO_DATA } from '$env/static/private';
import { upload } from '$lib/object_storage/upload';
import { unlinkSync } from 'fs';

const NO_PROJECTS: number = 5;

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');

	const pageNoParam: string = event.url.searchParams.get('page') ?? '0';
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

	// const summarised_projects = projects.filter((item) => {
	// 	return item.status == 'SUMMARISED';
	// });
	// if (summarised_projects.length > 0) {
	// 	uploadSummaryToS3(summarised_projects[0]);
	// }
	return { noProjects, pageNo, projects };
};

// async function uploadSummaryToS3(project: any) {
// 	//upload pdf to the s3
// 	console.log(project);
// 	let latexCode = '';
// 	const filename = `${project.title}_${project.id}`;
// 	const type = 'pdf';
// 	const outputType: OutputType = OutputType.PDF;
// 	const uuid = project.uuid;

// 	if (project.hasSlides) {
// 		const slidesData = JSON.parse(JSON.stringify(project.data)) as PrismaSlidesData[];
// 		const latexBody = getBodyLatexCode(
// 			slidesData.map((slideData) => slideData.slide),
// 			slidesData.map((slideData) => {
// 				const finalSummary = '';
// 				slideData.summaries.forEach((summary) => finalSummary.concat(summary));
// 				return finalSummary;
// 			})
// 		);
// 		latexCode = addToTemplate(project.title, '', latexBody);
// 	} else {
// 		latexCode = addToTemplate(
// 			project.title,
// 			'',
// 			(JSON.parse(JSON.stringify(project.data)) as PrismaBasicData).summary
// 		);
// 	}

// 	const filepath = path.join(PATH_TO_DATA, filename);
// 	console.log(`Outputting to ${filepath}`);
// 	await output(latexCode, filepath, outputType);

// 	console.log(`Output to ${filepath}`);

// 	const destination = `${uuid}/summaries/${filename}.${type}`;
// 	console.log(`Uploading ${filepath}.${type} to S3: ${destination}.`);
// 	await upload(`${filepath}.${type}`, destination);

// 	console.log(`Uploaded to S3.`);

// 	// has to sleep as the link does not become available to use immediately
// 	await new Promise((resolve) => setTimeout(resolve, 500));
// 	unlinkSync(`${filepath}.${type}`);
// }
