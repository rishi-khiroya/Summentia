import type { Session } from '@auth/core/types';
import type { PageServerLoad } from './new/$types';
import { redirect } from '@sveltejs/kit';
import { signIn } from '@auth/sveltekit/client';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	// console.log(session?.user);
	if (session?.user) throw redirect(303, '/dashboard');
	// else signIn('auth0');
	return {};
};
