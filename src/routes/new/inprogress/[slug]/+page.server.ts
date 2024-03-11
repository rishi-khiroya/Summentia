import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	PrismaProjectStatus,
	type PrismaProject,
	type PrismaSlidesData,
	type PrismaBasicData
} from '$lib/types/prisma';
import { summarise } from '$lib/server/summariser';
import { redirect } from '@sveltejs/kit';
import { process_genslides, process_noslides, process_slides } from '$lib/server/python';
import path from 'node:path';
import { PATH_TO_DATA } from '$env/static/private';

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
			uuid: data.uuid,
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

		// console.log(`waiting=${project.waiting}, ${data.waiting}`);
		// console.log(project);
		if (project.waiting) {
			if (project.status == PrismaProjectStatus.UNPROCESSED) {
				console.log('Sending request to Python back-end to complete splitting and transcription.');

				await setWaiting(project.id);
				const uuid = project.uuid;
				console.log('project hasSlides = ' + project.hasSlides);
				const response =
					project.hasSlides && !!project.slides
						? await process_slides(uuid)
						: await process_genslides(uuid);

				console.log('Received from back-end.');

				const data = JSON.parse(JSON.stringify(response.data));
				console.log(data);

				if (!response.success || !data) {
					if (!response.success) {
						record = await prisma.project.update({
							where: { id: project.id },
							data: {
								waiting: true
							}
						});
						error(400, data.toString());
					}

					record = await prisma.project.update({
						where: { id: project.id },
						data: {
							data: Object.values(data),
							waiting: true,
							hasSlides: true,
							status: 'TRANSCRIBED'
						}
					});
				}

				if (project.status == PrismaProjectStatus.SPLIT) {
					console.log('Starting transcription.');
					await setWaiting(project.id);

					// const extlessPath: string = project.video.substring(0, project.video.lastIndexOf('.'));

					let data;
					if (project.hasSlides) {
						console.log('should not reach here.'); // TODO: throw error/remove dead code
						// const transcript = process_noslides()
					} else {
						// const transcript = await transcribe(extlessPath);
						const uuid = project.uuid;
						// if (lastSlash == -1) error(503, 'Project video path is corrupt.');

						const transcript: string = await process_noslides(uuid);
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
						await Promise.all(
							slidesData.map(async (slideData) => {
								const summaries: string[] = [];
								await Promise.all(
									slideData.transcripts.map(async (transcript) => {
										const summary: string | null = await summarise(
											transcript,
											project.customisation.summaryLevel - 1
										);
										summaries.push(summary ?? '');
									})
								);
								slideData.summaries = summaries;
								console.log(summaries);
							})
						);
						data = slidesData;
						console.log(data);
					} else {
						const transcript: string = (project.data as PrismaBasicData).transcript;
						const summary: string | null = await summarise(transcript, 2);
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
			} else return { project: JSON.stringify(project) };

			return {
				project: JSON.stringify(record)
			};
		}
	}
};
