<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PrismaProjectStatus } from '$lib/types/Prisma.js';
	import { Spinner } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	export let data;

	const interval = setInterval(async () => {
		console.log('Refreshing data...');
		invalidateAll();
	}, 3000);

	onDestroy(() => clearInterval(interval));

	const status: () => string = (): string => {
		switch (data.project.status) {
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

<div class="flex flex-col p-5 m-10 bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
	{#key data}
		<div class="flex-col text-center p-10 space-y-5">
			<Spinner size="16" />
			<h1 class="text-4xl animate-bounce pt-3">{status()}</h1>
		</div>
	{/key}
</div>
