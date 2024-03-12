<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { reformat_date } from '$lib/utils.js';
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip,
		Modal,
		Textarea,
		Checkbox,
		Alert
	} from 'flowbite-svelte';
	import {
		ArrowRightOutline,
		DotsHorizontalOutline,
		DownloadOutline,
		EditOutline,
		EyeOutline,
		PlayOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import DownloadModal from '../DownloadModal.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { DIGITAL_OCEAN_ENDPOINT } from '$lib/object_storage/static';

	let PdfViewer;

	export let data;

	const projects = data.projects;

	let showDownloadModal: boolean = false;
	let currentProject = projects.filter((item) => {
		return item.status == 'SUMMARISED';
	})[0];

	let filename = data.sanitised_filename;

	// let previewURL = currentProject?( `./root/data/${filename}.pdf`):"";
	const previewURL = `${DIGITAL_OCEAN_ENDPOINT}/${currentProject.uuid}/summaries/${filename}.pdf`;
	console.log("Prieview URL " + previewURL);
	// let previewURL = currentProject?( `https://summentia-storage.fra1.cdn.digitaloceanspaces.com/d7ab5e9a-e61a-48e6-b51c-bd7a14cb5cce/summaries/IDB_Serial_Execution.pdf`):"";

	function isSummarised(project): boolean {
		return project.status == 'SUMMARISED' || project.status == 'COMPLETED';
	}

	async function deleteProject(item) {
		const form = new FormData();
		console.log(item.id);
		form.append('id', item.id);
		await fetch('?/delete', {
			method: 'POST',
			body: form
		});
		invalidateAll();
	}

	onMount(async () => {
		const module = await import('svelte-pdf');
		PdfViewer = module.default;
	});

	let showDeleteModal: [boolean, any] = [false, null];
</script>

<!--  the filename will be stored in the S3 storage with the format title_id -->
{#if currentProject}
	<DownloadModal bind:open={showDownloadModal} bind:project={currentProject} />
{/if}

<Modal bind:open={showDeleteModal[0]} size="xs" autoclose>
	<div class="text-center" id="deletemodal">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this project?
		</h3>
		<Button color="red" on:click={() => deleteProject(showDeleteModal[1])}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>

<div class="flex flex-col p-10">
	<h1 class="text-4xl p-10 font-bold dark:text-white">Dashboard</h1>
	<div class="flex space-x-10 py-5">
		<div
			class="flex-1 flex-col bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-2"
		>
			<h2 class="text-xl px-2 font-semibold dark:text-white">Your most recent summary:</h2>
			<!-- FIXME: not null-safe, doesn't work if latest project has slides -->
			{#if projects.filter((item) => {
				return item.status === 'SUMMARISED';
			}) && projects.filter((item) => {
					return item.status === 'SUMMARISED';
				}).length > 0}
				<!-- <div class="w-[650px]">
				<svelte:component class="w-[500px]" this={PdfViewer} url={previewURL}/>
				</div> -->
				<object title="cdsd" data={previewURL} type="application/pdf" width="650" height="650">
					<iframe title="xcd" src={previewURL} width="650" height="650">
						<p>This browser does not support PDF!</p>
					</iframe>
				</object>
			{:else}
				<h1>You have no recent projects.</h1>
			{/if}
		</div>

		<div
			class="flex flex-col bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl p-10 space-y-3 align-top"
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
								<div class="flex flex-row space-x-5 items-center justify-center">
									{#if isSummarised(item)}
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
									{:else}
										<h1 class="px-4 font-semibold">Unavailable</h1>
									{/if}
									<button
										class="hover:cursor-pointer"
										on:click={() => {
											showDeleteModal = [true, item];
										}}
									>
										<TrashBinOutline size="lg" id="delete" />
										<Tooltip triggeredBy="#delete">Delete Project</Tooltip>
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
