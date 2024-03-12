import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../$types';
import { error, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { removeFromDB } from '$lib/server/types/Project';
import type { Project } from '@prisma/client';
import path from 'node:path';
import type { PrismaSlidesData } from '$lib/types/prisma';
import { PATH_TO_DATA } from '$env/static/private';
import { upload } from '$lib/object_storage/upload';
import { DIGITAL_OCEAN_ENDPOINT } from '$lib/object_storage/static';

const ITEMS_PER_PAGE: number = 8;

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');

	const pageNoParam: string = event.url.searchParams.get('page') ?? '1';
	let pageNo: number = pageNoParam ? Number(pageNoParam) : 1;
	if (pageNo <= 0) pageNo = 1;

	// Load useful data
	const noProjects: number | undefined =
		(
			await prisma.user.findUnique({
				where: {
					id: session.user.id
				},
				select: {
					projects: true
				}
			})
		)?.projects.length ?? 0;

	const projects: Project[] = await prisma.project.findMany({
		where: {
			userId: session.user.id
		},
		skip: (pageNo - 1) * ITEMS_PER_PAGE,
		take: ITEMS_PER_PAGE,
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { noProjects, pageNo, projects };
};

export const actions = {
	delete: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id').toString());
		await removeFromDB(id);
		console.log('finished delete');
	},

	fix: async ({ request }) => {
		const uploadSlides = async (
			uuid: string,
			data: {
				slide: string;
				transcripts: string[];
				summaries: string[];
				squashed: boolean;
			}[]
		): Promise<PrismaSlidesData[]> => {
			const slidesFolder = path.join(PATH_TO_DATA, uuid, 'slides');
			return await Promise.all(
				data.map(async (slide) => {
					const parsedPath = path.parse(slide.slide);
					const filename = parsedPath.name + parsedPath.ext;
					const destination = path.join(slidesFolder, filename);
					await upload(slide.slide, destination);

					return {
						slide: slide.slide,
						transcripts: slide.transcripts,
						summaries: slide.summaries,
						squashed: slide.squashed,
						url: path.join(DIGITAL_OCEAN_ENDPOINT, destination)
					};
				})
			);
		};

		const form = await request.formData();
		const id = form.get('id')?.toString();
		const uuid = form.get('uuid')?.toString();
		const data = form.get('data')?.toString();

		if (!id || !uuid || !data) error(400, 'Invalid form');

		const json = JSON.parse(data);
		console.log(json);

		const newData = await uploadSlides(uuid, json);

		const record = await prisma.project.update({
			where: {
				id: Number(id),
				uuid
			},
			data: {
				// @ts-expect-error: Unsafe typecast.
				data: newData
			}
		});

		console.log(record);
	}
};
