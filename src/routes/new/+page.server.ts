import type { Session } from '@auth/core/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	return { session };
};
