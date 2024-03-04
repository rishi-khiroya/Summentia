<script lang="ts">
	import { goto } from '$app/navigation';
	import { reformat_date } from '$lib/utils.js';
	import {
		Button,
		Hr,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';
	import {
		ArrowRightOutline,
		DownloadOutline,
		EditOutline,
		EyeOutline
	} from 'flowbite-svelte-icons';
	import DownloadModal from '../DownloadModal.svelte';

	export let data;

	const projects = data.projects;

	let showDownloadModal: boolean = false;
	let currentProject = data.projects[0];
</script>

<!--  the filename will be stored in the S3 storage with the format title_id -->
<DownloadModal bind:open={showDownloadModal} bind:project={currentProject} />

<div class="flex flex-col p-10">
	<h1 class="text-4xl p-10 font-bold dark:text-white">Dashboard</h1>
	<div class="flex space-x-10 py-5">
		<div
			class="flex-1 flex-col bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5"
		>
			<h2 class="text-xl px-2 font-semibold dark:text-white">Your most recent summary:</h2>
			<!-- FIXME: not null-safe, doesn't work if latest project has slides -->
			{#if projects?.length && projects[0].data}
				<div class="flex flex-row justify-between space-x-5 p-3">
					<h1 class="text-2xl">{projects[0].title}</h1>
					<h3 class="text-xl">{reformat_date(projects[0].date)}</h3>
				</div>
				<Hr />
				<h3>{projects[0].data.summary}</h3>
				<div class="flex w-full justify-end p-5">
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
					<TableHeadCell>Quick Actions</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each projects as item}
						<TableBodyRow>
							<TableBodyCell>{item.title}</TableBodyCell>
							<TableBodyCell>{reformat_date(item.date)}</TableBodyCell>
							<TableBodyCell>
								{item.status[0].toUpperCase() + item.status.substring(1).toLowerCase()}
							</TableBodyCell>
							<TableBodyCell>
								<div class="flex flex-row space-x-5">
									<button
										class="hover:cursor-pointer"
										on:click={() => goto(`/projects/${item.id}`)}
									>
										<EyeOutline size="lg" id="view" />
										<Tooltip triggeredBy="#view">View Project</Tooltip>
									</button>
									<button class="hover:cursor-pointer" on:click={() => goto(`/edit/${item.id}`)}>
										<EditOutline size="lg" id="edit" />
										<Tooltip triggeredBy="#edit">Edit Project</Tooltip>
									</button>
									<button
										class="hover:cursor-pointer"
										on:click={() => {
											currentProject = item;
											showDownloadModal = true;
										}}
									>
										<DownloadOutline size="lg" id="download" />
										<Tooltip triggeredBy="#download">Download Project</Tooltip>
									</button>
								</div>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
			<div class="flex w-full mt-10 justify-end align-bottom">
				<Button outline color="alternative" href="/projects">
					All Projects <ArrowRightOutline class="w-3.5 h-3.5 ms-2" />
				</Button>
			</div>
		</div>
	</div>
</div>
