import type { Session } from '@auth/core/types';
import type { PageServerLoad } from '../../$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');
	return {};
}