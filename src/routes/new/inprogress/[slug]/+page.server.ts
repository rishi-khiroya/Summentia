import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	PrismaProjectStatus,
	type PrismaProject,
	type PrismaSlidesData,
	type PrismaBasicData
} from '$lib/types/Prisma';
import { summarise } from '$lib/server/summariser';
import { redirect } from '@sveltejs/kit';
import { process_noslides } from '$lib/server/python'

const setWaiting = async (id: number) =>
	await prisma.project.update({
		where: { id },
		data: {
			waiting: false
		}
	});

export const load: PageServerLoad = async ({ params }) => {
	const data = await prisma.project.findUnique({
		where: {
			id: Number(params.slug)
		}
	});

	if (!data) error(503, 'Project not found.');

	if (!data.waiting) {
		if (data.status == 'COMPLETED') {
			redirect(302, `/projects/${data.id}`);
		} else if (data.status == 'SUMMARISED') {
			redirect(302, `/edit/${data.id}`);
		}
	}
	return { id: data.id, status: PrismaProjectStatus[data.status], waiting: data.waiting };
};

export const actions = {
	fetch: async ({ params }) => {
		const data = await prisma.project.findUnique({
			where: {
				id: Number(params.slug)
			}
		});

		if (!data) error(503, 'Project not found.');

		if (!data.waiting) {
			if (data.status == 'COMPLETED') {
				redirect(303, `/projects/${data.id}`);
			} else if (data.status == 'SUMMARISED') {
				redirect(303, `/edit/${data.id}`);
			}
		}

		const project: PrismaProject = {
			id: data.id,
			title: data.title,
			userId: data.userId,
			date: data.date,
			createdAt: data.createdAt,
			hasSlides: data.hasSlides,
			video: data.video, // path of the video on the vm
			slides: data.slides,
			data: JSON.parse(JSON.stringify(data.data)),
			status: PrismaProjectStatus[data.status],
			waiting: data.waiting,
			customisation: JSON.parse(JSON.stringify(data.customisation))
		};

		let record;

		if (project.waiting) {
			if (project.status == PrismaProjectStatus.UNPROCESSED) {
				console.log('Sending request to Python back-end to complete splitting.');
			}

			if (project.status == PrismaProjectStatus.SPLIT) {
				console.log('Starting transcription.');
				await setWaiting(project.id);

				// const extlessPath: string = project.video.substring(0, project.video.lastIndexOf('.'));

				let data;
				if (project.hasSlides) {
					data = [
						{
							slide: 'Not implemented yet.',
							transcript: 'Not implemented yet.',
							summary: 'Not implemented yet.'
						}
					] as PrismaSlidesData[];

					// const transcript = process_noslides()
				} else {
					// const transcript = await transcribe(extlessPath);
					const lastSlash = project.video.lastIndexOf('/');
					if (lastSlash == -1) error(503, 'Project video path is corrupt.');

					const projectFolder = project.video.substring(0, lastSlash);

					const transcript: string = await process_noslides(projectFolder);
					data = {
						transcript: transcript ? transcript : 'Unable to transcribe.',
						summary: ''
					} as PrismaBasicData;
				}

				record = await prisma.project.update({
					where: { id: project.id },
					data: {
						// @ts-expect-error: Cannot force the typecast.
						data,
						waiting: true,
						status: 'TRANSCRIBED'
					}
				});
				console.log('Finished transcription.');
			}

			if (project.status == PrismaProjectStatus.TRANSCRIBED) {
				console.log('Starting summarisation.');
				await setWaiting(project.id);

				let data;
				if (project.hasSlides) {
					const slidesData: PrismaSlidesData[] = project.data as PrismaSlidesData[];
					slidesData.forEach(async (slideData) => {
						const summary: string | null = await summarise(
							slideData.transcript,
							project.customisation.summaryLevel - 1
						);
						slideData.summary = summary ? summary : 'Error...';
					});
					data = slidesData.map((data) => JSON.stringify(data));
				} else {
					const transcript: string = (project.data as PrismaBasicData).transcript;
					const summary: string | null = await summarise(transcript);
					data = { transcript, summary: summary ? summary : 'Error...' };
				}

				record = await prisma.project.update({
					where: { id: project.id },
					data: {
						data,
						waiting: false,
						status: 'SUMMARISED'
					}
				});
				console.log('Finished summarisation.');
			}
		}

		return {
			project: JSON.stringify(record)
		};
	}
};
