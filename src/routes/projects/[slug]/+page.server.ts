import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../../$types';
import { redirect, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Project } from '@prisma/client';
import { addToTemplate, getBodyLatexCode } from '$lib/server/latex_generation';
import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/Prisma';
import { OutputType, output } from '$lib/server/output_engine';
import { PATH_TO_DATA } from '$env/static/private';
import { unlinkSync } from 'fs';
import { upload } from '$lib/object_storage/upload';
import { DIGITAL_OCEAN_SUMMARIES_FOLDER } from '$lib/object_storage/static';
import path from 'node:path';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');

	const pageNoParam: string = event.url.searchParams.get('page') ?? '1';
	let pageNo: number = pageNoParam ? Number(pageNoParam) : 1;
	if (pageNo <= 0) pageNo = 1;

	const slug = event.params.slug;

	if (isNaN(Number(slug))) error(404, 'Error: Project not found.');

	const project: Project | null = await prisma.project.findUnique({
		where: {
			id: Number(slug)
		}
	});

	if (project == null) error(503, 'Unable to fetch project details. Please try again later.');

	return { pageNo, project };
};

export const actions = {
	download: async ({ request, params, locals }) => {
		console.log('Downloading...');

		const form = await request.formData();

		const type = form.get('type')?.toString();

		// @ts-expect-error: Use of unsafe enum acccss.
		const outputType: OutputType = OutputType[type.toUpperCase()];
		console.log(`Output Type = ${outputType}`);

		const filename = form.get('filename')?.toString();

		if (!type || !filename) error(400, 'Invalid form data.');

		const session: Session | null = await locals.auth();
		const userId: string | undefined = session?.user.id;

		const data = await prisma.project.findUnique({
			where: {
				id: Number(params.slug),
				userId
			}
		});

		if (!data) error(503, 'No project found');

		let latexCode = '';

		if (data.hasSlides) {
			const slidesData = JSON.parse(JSON.stringify(data.data)) as PrismaSlidesData[];
			const latexBody = getBodyLatexCode(
				slidesData.map((slideData) => slideData.slide),
				slidesData.map((slideData) => slideData.summary)
			);
			latexCode = addToTemplate(data.title, session?.user.name ?? '', latexBody);
		} else {
			latexCode = addToTemplate(
				data.title,
				session?.user.name ?? '',
				(JSON.parse(JSON.stringify(data.data)) as PrismaBasicData).summary
			);
		}

		const filepath = path.join(PATH_TO_DATA, filename);
		console.log(`Outputting to ${filepath}`);
		await output(latexCode, filepath, outputType);

		console.log(`Output to ${filepath}`);

		const url = path.join(DIGITAL_OCEAN_SUMMARIES_FOLDER, `${filename}.${type}`);
		console.log(`Uploading ${filepath}.${type} to S3: ${url}.`);
		await upload(`${filepath}.${type}`, url);

		console.log(`Uploaded to S3.`);

		// has to sleep as the link does not become available to use immediately
		await new Promise((resolve) => setTimeout(resolve, 500));
		// unlinkSync(path);
	}
};
