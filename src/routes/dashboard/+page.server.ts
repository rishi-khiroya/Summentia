import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { Project } from '@prisma/client';
import { OutputType, output } from '$lib/server/output_engine';
import { addToTemplate, getBodyLatexCode } from '$lib/server/latex_generation';
import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/prisma';
import path from 'path';
import { PATH_TO_DATA } from '$env/static/private';
import { removeFromDB } from '$lib/server/types/Project';
import { sanitise_filename } from '$lib/utils';
import { uploadForView } from '$lib/object_storage/upload';
import { check_exists } from '$lib/object_storage/helper';

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

	const summarised_projects = projects.filter((item) => {
		return item.status == 'SUMMARISED';
	});
	let sanitised_filename = "Summary";
	if (summarised_projects.length > 0) {
		sanitised_filename = sanitise_filename(summarised_projects[0].title);
		sanitised_filename += "_View";
		await generateRecentPDF(summarised_projects[0], sanitised_filename);
	}

	return { noProjects, pageNo, projects, sanitised_filename };
};

export const actions = {
	delete: async ({request}) => {
		const form = await request.formData();
		const id = Number(form.get('id').toString());
		await removeFromDB(id)
		console.log("finished delete")
	}
}


async function generateRecentPDF(project: any, filename: string) {
	//upload pdf to the s3
	let latexCode = '';
	const outputType: OutputType = OutputType.PDF;

	let backupSummaryCode = '';
	let backupLatexCode = '';

	if (project.hasSlides) {
		const slidesData = JSON.parse(JSON.stringify(project.data)) as PrismaSlidesData[];
		const latexBody = getBodyLatexCode(
			slidesData.map((slideData) => slideData.slide),
			slidesData.map((slideData) => {
				const slideSummary = slideData.summaries.reduce((a, b) => a + " " + b, "");
				backupSummaryCode = backupSummaryCode + ' ' + slideSummary;
				return slideSummary;
			})
		);
		console.log("Latex Body: "+ latexBody);
		latexCode = addToTemplate(project.title, '', latexBody);
	} else {
		latexCode = addToTemplate(
			project.title,
			'',
			(JSON.parse(JSON.stringify(project.data)) as PrismaBasicData).summary
		);
		backupSummaryCode = (JSON.parse(JSON.stringify(project.data)) as PrismaBasicData).summary;

	}

	const filepath = path.join(PATH_TO_DATA, filename);
	console.log(`Outputting to ${filepath}`);
	const isOutputCorrect = await output(latexCode, filepath, outputType);
	if(!isOutputCorrect){
		backupLatexCode = addToTemplate(project.title, '', backupSummaryCode);
		console.log("latex: " + backupLatexCode);
		await output(backupLatexCode, filepath, outputType);
	}
	const destination = `${project.uuid}/summaries/${filename}.pdf`;
	const does_it_exist = check_exists(destination);
	// const does_it_exist = false
	if(!does_it_exist){
		await uploadForView(`${filepath}.pdf`, destination)
		console.log("uploaded: " + destination);
	} else {
		"it exists "
	}

	await new Promise((resolve) => setTimeout(resolve, 1000));
}