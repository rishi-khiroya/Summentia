import { SvelteKitAuth } from "@auth/sveltekit"
import Auth0 from "@auth/sveltekit/providers/auth0"

export const handle = SvelteKitAuth({
    providers: [
        Auth0
    ]
});