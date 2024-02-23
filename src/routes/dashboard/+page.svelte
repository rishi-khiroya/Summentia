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
		Table
	} from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { reformat_date } from '$lib/utils.js';
	import { goto } from '$app/navigation';

	export let data;

	let searchTerm: string = '';
	const recent_projects = data.projects;

	function nav_to_project_page(project_id: number) {
		console.log(project_id);
		goto('projects/' + project_id.toString());
	}
</script>

<div class="flex flex-col p-10">
	<h1 class="text-4xl p-10 font-bold dark:text-white">Dashboard</h1>
	<div class="flex space-x-10 py-5">
		<div
			class="flex flex-col bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5"
		>
			<h2 class="text-xl px-2 font-semibold dark:text-white">Your most recent summary:</h2>
			<div class="flex space-x-5 py-3">
				<Badge rounded large color="dark" class="w-55 h-19">
					<div class="px-5 py-3">
						<h1>{recent_projects[0].title}</h1>
						<h3>{reformat_date(recent_projects[0].createdAt)}</h3>
					</div>
				</Badge>
			</div>
			<ImagePlaceholder alt="sample 1" />
			<h3>{recent_projects[0].data.summary}</h3>
			<div class="flex w-full bottom-5 right-5">
				<Button class="right-0" href={``}>View</Button>
			</div>
		</div>

		<div
			class="flex flex-col bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl p-10 space-y-3 justify-center align-top"
		>
			<h2 class="text-xl px-2 font-semibold dark:text-white">Recent Projects:</h2>
			<Table>
				<TableHead>
					<TableHeadCell>Title</TableHeadCell>
					<TableHeadCell>Date</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each recent_projects as item}
						<TableBodyRow on:click={() => nav_to_project_page(item.id)}>
							<!-- <TableBodyCell>{item.id}</TableBodyCell> -->
							<TableBodyCell>{item.title}</TableBodyCell>
							<TableBodyCell>{reformat_date(item.date)}</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
			<p class="underline text-right font-medium text-gray-600 px-3 dark:text-gray-400">
				<a href="/projects">All Projects <ArrowRightOutline class="w-3.5 h-3.5 ms-2" /></a>
			</p>
			<p></p>
		</div>
	</div>
</div>
