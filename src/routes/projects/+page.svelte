<script lang="ts">
	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Pagination,
		Tooltip
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { reformat_date } from '$lib/utils.js';
	import { DownloadOutline, EditOutline, EyeOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import type { Project } from '@prisma/client';
	import { Button, Modal } from 'flowbite-svelte';
	import DownloadModal from '../DownloadModal.svelte';
	import { invalidateAll } from '$app/navigation';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let data;

	const MAX_NO_PAGES: number = 5;
	const ITEMS_PER_PAGE: number = 10;
	let searchTerm: string = '';
	$: filteredItems = data.projects.filter(
		(project) => project.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	function isSummarised(project): boolean {
		return project.status == 'SUMMARISED';
	}

	let startPoint: number = Math.max(data.pageNo - 2, 1);

	$: pages = Array.from(
		{
			length: MAX_NO_PAGES
		},
		(value, index) => startPoint + index
	)
		.filter((id: number) => id <= Math.max(1, Math.ceil(data.noProjects / ITEMS_PER_PAGE)))
		.map((id: number) => {
			return {
				name: id.toString(),
				href: `/projects?page=${id}`,
				active: id === data.pageNo
			};
		});

	const previous = () => {
		const params = new URLSearchParams(window.location.search);
		if (parseInt(params.get('page')) == 1) {
			return;
		}
		const page = Math.max(parseInt(params.get('page') ?? '1') - 1, 1);
		params.set('page', page.toString());
		window.location.search = params.toString();
	};
	const next = () => {
		const params = new URLSearchParams(window.location.search);
		const pageNo = parseInt(params.get('page') ?? '1');
		const page = Math.min(pageNo + 1, Math.ceil(data.noProjects / ITEMS_PER_PAGE));
		if (pageNo == page) {
			return;
		}
		params.set('page', page.toString());
		window.location.search = params.toString();
	};

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

	let showDeleteModal: [boolean, any] = [false, null];
	let showDownloadModal: boolean = false;
	let currentProject: Project = data.projects[0];
</script>

<!--  the filename will be stored in the S3 storage with the format title_id -->
<DownloadModal bind:open={showDownloadModal} bind:project={currentProject} />

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

<div class="flex flex-col w-full p-10 space-y-3 justify-center align-top">
	<h1 class="text-4xl px-10 font-bold dark:text-white">Projects</h1>
	<TableSearch placeholder="Search by project title" hoverable={true} bind:inputValue={searchTerm}>
		<TableHead>
			<TableHeadCell>Title</TableHeadCell>
			<TableHeadCell>Date</TableHeadCell>
			<TableHeadCell>Created At</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Quick Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each filteredItems as item}
				<TableBodyRow>
					<TableBodyCell>{item.title}</TableBodyCell>
					<TableBodyCell>{reformat_date(item.date)}</TableBodyCell>
					<TableBodyCell>{reformat_date(item.createdAt)}</TableBodyCell>
					<TableBodyCell>
						{item.status[0].toUpperCase() + item.status.substring(1).toLowerCase()}
					</TableBodyCell>

					<TableBodyCell>
						<div class="flex flex-row space-x-5 items-center justify-center">
							{#if isSummarised(item)}
								<button class="hover:cursor-pointer" on:click={() => goto(`/projects/${item.id}`)}>
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
	</TableSearch>

	{#key pages}
		<Pagination {pages} on:previous={previous} on:next={next} />
	{/key}
</div>
