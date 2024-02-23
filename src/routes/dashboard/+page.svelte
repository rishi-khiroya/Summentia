<script lang="ts">
	import {
		Badge,
		Button,
		ImagePlaceholder,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Table,
		Hr
	} from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { reformat_date } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { PrismaProjectStatus } from '$lib/types/Prisma';

	export let data;

	const projects = data.projects;
</script>

<div class="flex flex-col p-10">
	<h1 class="text-4xl p-10 font-bold dark:text-white">Dashboard</h1>
	<div class="flex space-x-10 py-5">
		<div
			class="flex-1 flex-col bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5"
		>
			<h2 class="text-xl px-2 font-semibold dark:text-white">Your most recent summary:</h2>
			{#if projects?.length}
				<div class="flex flex-row justify-between space-x-5 p-3">
					<h1 class="text-4xl">{projects[0].title}</h1>
					<h3 class="text-xl">{reformat_date(projects[0].date)}</h3>
				</div>
				<Hr />
				<h3>{projects[0].data.summary}</h3>
				<div class="flex w-full justify-end">
					<Button href={`/projects/${projects[0].id}`}>View</Button>
				</div>
			{:else}
				<h1>You have no recent projects.</h1>
			{/if}
		</div>

		<div
			class="flex flex-col bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl p-10 space-y-3 justify-center align-top"
		>
			<h2 class="text-xl px-2 font-semibold dark:text-white">Recent Projects:</h2>
			<Table>
				<TableHead>
					<TableHeadCell>Title</TableHeadCell>
					<TableHeadCell>Date</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each projects as item}
						<TableBodyRow on:click={() => goto(`/projects/${item.id}`)}>
							<!-- <TableBodyCell>{item.id}</TableBodyCell> -->
							<TableBodyCell>{item.title}</TableBodyCell>
							<TableBodyCell>{reformat_date(item.date)}</TableBodyCell>
							<TableBodyCell
								>{item.status[0].toUpperCase() +
									item.status.substring(1).toLowerCase()}</TableBodyCell
							>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
			<div class="flex w-full mt-10 justify-end align-bottom">
				<Button outline color="alternative" href="/prijects">
					All Projects <ArrowRightOutline class="w-3.5 h-3.5 ms-2" />
				</Button>
			</div>
		</div>
	</div>
</div>
