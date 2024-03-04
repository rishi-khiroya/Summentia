<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PrismaProjectStatus, type PrismaProject } from '$lib/types/Prisma.js';
	import { formResponseToJSON } from '$lib/utils.js';
	import { Spinner } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	export let data;

	let project;
	let fetched: boolean = false;

	if (data?.status) fetched = true;
	console.log(data);

	let fetching: boolean = false;

	const interval = setInterval(async () => {
		// invalidateAll();

		if (fetching) return;
		console.log('Refreshing data...');
		fetching = false;

		const form = new FormData();
		form.append('id', data.id.toString());

		const response = await fetch('?/fetch', {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			console.log(response);
			const json = await response.json();
			console.log(json);
			const responseData = formResponseToJSON(json.project.toString());

			console.log(responseData);
			project = responseData;
			fetched = true;
		}

		fetching = false;


	}, 3000);

	onDestroy(() => clearInterval(interval));

	const status: () => string = (): string => {
		switch (data.status) {
			case PrismaProjectStatus.SPLIT:
				return 'Transcribing...';
			case PrismaProjectStatus.TRANSCRIBED:
				return 'Summarising...';
			case PrismaProjectStatus.UNPROCESSED:
				return 'Splitting...';
			default:
				return 'Processing...';
		}
	};
</script>

<div class="flex flex-col w-full p-10 m-20 bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
	{#key fetching}
		<div class="flex-col text-center p-10 space-y-5">
			<Spinner size="16" />
			{#if fetched}
				<h1 class="text-4xl animate-bounce pt-3 dark:text-white">{status()}</h1>
			{/if}
		</div>
	{/key}
</div>
