<script>
	import { Button } from 'flowbite-svelte';
	import { signIn } from '@auth/sveltekit/client';
</script>

<div
	class="flex-1 flex-col items-center text-black dark:text-white bg-white dark:bg-slate-800 outline-1 shadow-md shadow-black rounded-xl space-y-2 m-20"
>
	<h1 class="text-5xl p-10 font-bold text-center">Welcome to Summentia!</h1>

	<p class="text-xl px-10 pb-5 w-full text-wrap text-center">
		This is a tool for lecturers and students to automically generate detailed and informative
		summaries based on a recording of a lecture and its slides.
	</p>

	<p class="text-xl pt-0 p-10 w-full px-96 text-wrap text-center">
		To get started,
		<button on:click={() => signIn('auth0')} class="underline italic font-semibold px-2">
			sign up (or sign in)
		</button>
		or
		<a href="/new" class="underline italic font-semibold px-2"> start a new project</a>
	</p>

	<div class="flex flex-col items-center justify-center self-center pt-0 p-20">
		<h1 class="text-xl font-semibold">3 Modes:</h1>
		<div class="grid grid-cols-3 gap-4">
			<div class="flex flex-col">
				<h3 class="text-lg font-medium underline">Full Summarisation</h3>
			</div>
			<div class="flex flex-col">
				<h3 class="text-lg font-medium underline">Slide-by-Slide Summarisation</h3>
			</div>
			<div class="flex flex-col">
				<h3 class="text-lg font-medium underline">Summarisation with Slide Generation</h3>
			</div>
		</div>
	</div>
</div>
