import type { Session } from "@auth/core/types";
import type { PageServerLoad } from "./new/$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
    console.log(session?.user);
	if (session?.user) throw redirect(303, '/dashboard');
	return {};
}