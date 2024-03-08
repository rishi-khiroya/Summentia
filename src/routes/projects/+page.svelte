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
	import { DownloadOutline, EditOutline, EyeOutline } from 'flowbite-svelte-icons';
	import type { Project } from '@prisma/client';
	import DownloadModal from '../DownloadModal.svelte';

	export let data;

	const NO_PAGES: number = 5;
	let searchTerm: string = '';
	$: filteredItems = data.projects.filter(
		(project) => project.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	function isSummarised(project): boolean{
		return project.status == "SUMMARISED"
	}

	let pages = Array.from(
		{
			length: NO_PAGES
		},
		(value, index) => index + 1
	)
		.filter((id: number) => id <= Math.min(1, Math.ceil(data.noProjects ?? 0 / NO_PAGES)))
		.map((id: number) => {
			return {
				name: id.toString(),
				href: `/projects?page=${id}`,
				active: id === data.pageNo
			};
		});

	const previous = () => {
		const params = new URLSearchParams(window.location.search);
		const page = Math.max(parseInt(params.get('page') ?? '1') - 1, 1);
		params.set('page', page.toString());
		window.location.search = params.toString();
	};
	const next = () => {
		const params = new URLSearchParams(window.location.search);
		const pageNo = parseInt(params.get('page') ?? '1');
		const page = Math.min(
			pageNo + 1,
			Math.ceil(data.noProjects ? data.noProjects - 1 : 0 / NO_PAGES)
		);
		params.set('page', page.toString());
		window.location.search = params.toString();
	};

	let showDownloadModal: boolean = false;
	let currentProject: Project = data.projects[0];

</script>

<!--  the filename will be stored in the S3 storage with the format title_id -->
<DownloadModal bind:open={showDownloadModal} bind:project={currentProject} />

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
						{#if isSummarised(item)}
						<div class="flex flex-row space-x-5">
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
						</div>
						{/if}
					</TableBodyCell>
					
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>

	<Pagination {pages} on:previous={previous} on:next={next} />
</div>
