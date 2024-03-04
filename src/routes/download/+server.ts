import { PATH_TO_DATA } from '$env/static/private';
import { DIGITAL_OCEAN_SUMMARIES_FOLDER } from '$lib/object_storage/static';
import { upload } from '$lib/object_storage/upload';
import { addToTemplate, getBodyLatexCode } from '$lib/server/latex_generation';
import { output } from '$lib/server/output_engine';
import { prisma } from '$lib/server/prisma';
import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/Prisma';
import type { Session } from '@auth/core/types';
import { error, json } from '@sveltejs/kit';
import { OutputType } from '$lib/server/output_engine';
import path from 'node:path';
import { unlinkSync } from 'node:fs';

export async function POST({ request, locals }) {
	console.log('Downloading...');

	const form = await request.formData();

	const type = form.get('type')?.toString();
	const id = form.get('id')?.toString();

	// @ts-expect-error: Use of unsafe enum acccss.
	const outputType: OutputType = OutputType[type.toUpperCase()];
	console.log(`Output Type = ${outputType}`);

	const filename = form.get('filename')?.toString();

	if (!id || !type || !filename) error(400, 'Invalid form data.');

	const session: Session | null = await locals.auth();
	const userId: string | undefined = session?.user.id;

	const data = await prisma.project.findUnique({
		where: {
			id: Number(id),
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
	unlinkSync(filepath);

	return json({ success: true });
}
