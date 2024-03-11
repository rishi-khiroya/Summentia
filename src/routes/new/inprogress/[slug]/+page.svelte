<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PrismaProjectStatus, type PrismaProject } from '$lib/types/prisma';
	import { formResponseToJSON } from '$lib/utils.js';
	import { Spinner } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	export let data;

	let project;
	let fetched: boolean = false;

	if (data?.status) fetched = true;
	console.log(data);

	let fetching: boolean = false;

	const interval = setInterval(async () => {
		// invalidateAll();

		if (fetching) {
			console.log('Waiting for data...');
			return;
		}
		console.log('Refreshing data...');
		fetching = true;

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
			if (json) {
				if (json.type === "redirect") goto(json.location);
				// console.log(json.data);
				const data = formResponseToJSON(json.data);
				console.log(data);
				// const responseData = JSON.parse(.project);

				// console.log(responseData + " " + typeof responseData);
				project = data;
				fetched = true;
			}
		}

		fetching = false;

		// console.log('id: ' + project.id);
	}, 30000);

	onDestroy(() => clearInterval(interval));

	const status: () => string = (): string => {
		const status = !!project ? project.status : data.status;
		console.log(`status=${status}`);
		console.log(`project=${project}`);
		switch (status) {
			case PrismaProjectStatus.SPLIT:
				return 'Transcribing...';
			case PrismaProjectStatus.TRANSCRIBED:
				return 'Summarising...';
			case PrismaProjectStatus.UNPROCESSED:
				return 'Splitting & Transcribing...';
			default:
				return 'Processing...';
		}
	};

	// Stop the page from refreshing without confirmation of losing data.
	function beforeUnload(event: BeforeUnloadEvent): string {
		event.preventDefault();
		event.returnValue = '';
		return '';
	}
</script>

<svelte:window on:beforeunload={beforeUnload} />

<div
	class="flex flex-col w-full p-10 m-20 mb-15 pb-5 bg-white dark:bg-slate-800 shadow-xl rounded-2xl"
>
	{#key project}
		<div class="flex-col text-center p-10 space-y-5">
			<Spinner size="16" />
			{#if fetched}
				<h1 class="text-4xl animate-bounce pt-3 dark:text-white">{status()}</h1>
			{/if}
			<h1 class="italic font-semibold mt-10 pt-10 animate-pulse text-red-700">
				Do not leave this page!
			</h1>
		</div>
	{/key}
</div>
