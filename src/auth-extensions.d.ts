// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SvelteKitAuth, DefaultSession } from "@auth/sveltekit"

declare module '@auth/sveltekit' {
    interface Session {
        user: {
            id: string;
        } & DefaultSession['user'];
    }
}