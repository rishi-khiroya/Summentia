import { PATH_TO_DATA } from '$env/static/private'
import { upload } from '$lib/object_storage/upload';
import { addToTemplate, getBodyLatexCode } from '$lib/server/latex_generation';
import { output } from '$lib/server/output_engine';
import prisma from '$lib/server/prisma';
import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/prisma';
import type { Session } from '@auth/core/types';
import { error, json } from '@sveltejs/kit';
import { OutputType } from '$lib/server/output_engine';
import path from 'node:path';
import { unlinkSync } from 'node:fs';
import { format } from '$lib/server/formatter';
import type { Customisation } from '$lib/types/Customisation.js';
import { sanitise_filename } from '$lib/utils.js';

export async function POST({ request, locals }) {
	console.log('Downloading...');

	const form = await request.formData();

	const type = form.get('type')?.toString();
	const id = form.get('id')?.toString();
	const uuid = form.get('uuid')?.toString();
	const customisation = form.get('customisation')?.toString();

	// @ts-expect-error: Use of unsafe enum acccss.
	const outputType: OutputType = OutputType[type.toUpperCase()];
	console.log(`Output Type = ${outputType}`);

	const title = form.get('title')?.toString()??"Summary";
	const filename = sanitise_filename(title);

	if (!id || !type || !filename || !customisation) error(400, 'Invalid form data.');
	// (JSON.parse(JSON.stringify(project.customisation))

	const session: Session | null = await locals.auth();
	const userId: string | undefined = session?.user.id;

	const data = await prisma.project.findUnique({
		where: {
			id: Number(id),
			userId
		}
	});

	if (!data) error(503, 'No project found');

	const customisations: Customisation = JSON.parse(customisation);

	let latexCode = '';

	if (data.hasSlides) {
		console.log("Data has slides");
		const slidesData = JSON.parse(JSON.stringify(data.data)) as PrismaSlidesData[];
		const latexBody = getBodyLatexCode(
			slidesData.map((slideData) => slideData.slide),
			slidesData.map((slideData) => {

				return slideData.summaries.reduce((a, b) => a + " " + b, "");

			})
		);
		console.log("GET body")
		latexCode = addToTemplate(data.title, session?.user.name ?? '', latexBody);
		console.log("Add to template")
	} else {
		latexCode = addToTemplate(
			data.title,
			session?.user.name ?? '',
			(JSON.parse(JSON.stringify(data.data)) as PrismaBasicData).summary
		);
	}

	// format the code according to the customisations
	console.log("started formating")
	const formattedlatexCode = (await format(latexCode, customisations)) ?? latexCode;
	console.log("NEW FILENAMEA; " + filename);

	const destination = `${uuid}/summaries/${filename}.${type}`;

	// do not check if it exists anymore as we always want to generate new documents in case the user does different customisations
	const filepath = path.join(PATH_TO_DATA, filename);

	console.log(`Outputting to ${filepath}`);
	const correctOutput = await output(formattedlatexCode, filepath, outputType);
	
	if(!correctOutput){
		await output(latexCode, filepath, outputType);
	}

	console.log(`Output to ${filepath}`);

	console.log(`Uploading ${filepath}.${type} to S3: ${destination}.`);
	await upload(`${filepath}.${type}`, destination);

	console.log(`Uploaded to S3.`);

	// has to sleep as the link does not become available to use immediately
	await new Promise((resolve) => setTimeout(resolve, 1000));
	console.log("Before unlink")
	unlinkSync(`${filepath}.${type}`);
	console.log("after unlink")
	return json({ success: true, sanitisedFilename: filename });
}
