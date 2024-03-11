<script>
	import {Button} from 'flowbite-svelte';
	import { signIn} from '@auth/sveltekit/client';
</script>

<div class="flex flex-col items-center">
    <h1 class="text-5xl p-10 font-bold">Home Page</h1>

    <div class="justify-center space-x-2 space-y-2 flex items-center">
        <div class="bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
            <h2 class="text-xl px-2 font-semibold flex items-center">Hi! Please use the button below to sign in </h2>
			<div class="flex justify-center">
            <Button
                outline
                color="light"
                on:click={() => signIn('auth0')}
                class=" text-primary-500 dark:text-primary-600 border dark:border-gray-800 dark:hidden"
            >Sign in </Button>
		</div>
        </div>
    </div>
</div>

