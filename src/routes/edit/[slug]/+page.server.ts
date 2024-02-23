import { prisma } from "$lib/server/prisma";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Session } from "@auth/core/types";

export const load: PageServerLoad = async ({ params, locals }) => {

    const session: Session | null = await locals.auth();
    const userId: string | undefined = session?.user.id;

    const data = await prisma.project.findUnique({
        where: {
            id: Number(params.slug)
        }
    });

    if (!data) error(503, "No project found");
    if (data.userId != userId) redirect(303, `/projects`);
    if (!data.video || !data.data || data.status != 'SUMMARISED') redirect(303, `/new/inprogress/${params.slug}`);

    return { data: JSON.parse(JSON.stringify(data.data)), hasSlides: data.hasSlides, id: data.id };

}

export const actions = {
    save: async ({ request }) => {
        const form = await request.formData();

        const data = form.getAll('data');
        const id = form.get('id');
        const userId = form.get('userId');
        if (!data || !id) error(503, "No form data found.");

        const record = await prisma.project.update({
            where: {
                id: Number(id.toString()),
                userId: userId?.toString()
            },
            data: {
                data: data.length == 1 ? JSON.parse(data[0].toString()) : data.map(data => JSON.parse(data.toString()))
            }
        })

        // console.log("Updated record.");

        return record?.id.toString() === id.toString();
        // return {};
    }
}