import { AUTH0_CLIENT_ID, AUTH0_ISSUER_BASE_URL, AUTH0_SECRET, AUTH0_CLIENT_SECRET } from "$env/static/private";
import { prisma } from "$lib/prisma";
import type { Adapter } from "@auth/core/adapters";
import { SvelteKitAuth } from "@auth/sveltekit"
import Auth0 from "@auth/sveltekit/providers/auth0"
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Handle } from "@sveltejs/kit";

export const handle = SvelteKitAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "database",
        generateSessionToken: () => {
            return crypto.randomUUID();
        }
    },
    providers: [
        Auth0({
            clientId: AUTH0_CLIENT_ID,
            clientSecret: AUTH0_CLIENT_SECRET,
            issuer: AUTH0_ISSUER_BASE_URL,
        })
    ],
    trustHost: true,
    secret: AUTH0_SECRET,
}) satisfies Handle;