<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PrismaProjectStatus } from '$lib/types/Prisma.js';
	import { redirect } from '@sveltejs/kit';
	import { Spinner } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	export let data;

	$: if (data.project.status === PrismaProjectStatus.COMPLETED)
		redirect(302, `/projects/${data.project.id}`);

	const interval = setInterval(async () => {
		if (data.project.waiting) {
			console.log('Refreshing data...');
			invalidateAll();
		}
	}, 3000);

	onDestroy(() => clearInterval(interval));

	const status: () => string = (): string => {
		switch (data.project.status) {
			case PrismaProjectStatus.COMPLETED:
				return 'Loading summary...';
			case PrismaProjectStatus.SPLIT:
				return 'Transcribing...';
			case PrismaProjectStatus.SUMMARISED:
				return 'Generating output...';
			case PrismaProjectStatus.TRANSCRIBED:
				return 'Summarising...';
			case PrismaProjectStatus.UNPROCESSED:
				return 'Splitting...';
		}
	};
</script>

<div class="flex flex-col p-5 m-10 bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
	{#if data.project.waiting}
		{#key data}
			<div class="flex-col text-center p-10 space-y-5">
				<Spinner size="16" />
				<h1 class="text-4xl animate-bounce pt-3">{status()}</h1>
			</div>
		{/key}
	{:else if data.project.status === PrismaProjectStatus.SPLIT}
		<!-- TODO: add timing editor thingy -->
	{:else if data.project.status === PrismaProjectStatus.TRANSCRIBED}
		<!-- Check transcriptions -->
	{:else if data.project.status === PrismaProjectStatus.SUMMARISED}
		<!-- Formatting page -->
	{/if}
</div>
