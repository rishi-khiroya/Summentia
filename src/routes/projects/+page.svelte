<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Pagination,
		Button
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { reformat_date } from '$lib/utils.js';

	export let data;

	const NO_PAGES: number = 5;
	let searchTerm: string = '';
	$: filteredItems = data.projects.filter(
		(project) => project.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	let pages = Array.from(
		{
			length: NO_PAGES
		},
		(value, index) => index
	)
		.filter((id: number) => id <= Math.max(0, Math.ceil(data.noProjects??0 / NO_PAGES)))
		.map((id: number) => {
			return {
				name: id,
				href: `/projects?page=${id}`,
				active: id === data.pageNo
			};
		});

	const determine_status = (project): string => {
		if (project.summary) return 'Summarised';
		if (project.transcript) return 'Transcribed';
		return 'Unprocessed';
	};

	const previous = () => {
		const params = new URLSearchParams(window.location.search);
    	const page = Math.max(parseInt(params.get('page')??"0") - 1, 0);
    	params.set('page', page.toString());
    	window.location.search = params.toString();
	};
	const next = () => {
		const params = new URLSearchParams(window.location.search);
    	const pageNo = parseInt(params.get('page')??"0");
    	const noProjects = parseInt((data.noProjects??0).toString()) || 0;
    	const page = Math.min(pageNo + 1, noProjects);
    	params.set('page', page.toString());
    	window.location.search = params.toString();
	};
	
	function nav_to_project_page(project_id:number) {
	console.log(project_id)
	goto('projects/' + project_id.toString());
	};
	
</script>

<div class="flex flex-col p-10 space-y-3 justify-center align-top">
	<h1 class="text-4xl px-10 font-bold">Projects</h1>
	<TableSearch placeholder="Search by project title" hoverable={true} bind:inputValue={searchTerm}>
		<TableHead>
			<TableHeadCell>Title</TableHeadCell>
			<TableHeadCell>Date</TableHeadCell>
			<TableHeadCell>Created At</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#each filteredItems as item}
		
				<TableBodyRow on:click={nav_to_project_page(item.id)}>
					<!-- <TableBodyCell>{item.id}</TableBodyCell> -->
					<TableBodyCell>{item.title}</TableBodyCell>
					<TableBodyCell>{reformat_date(item.date)}</TableBodyCell>
					<TableBodyCell>{reformat_date(item.createdAt)}</TableBodyCell>
					<TableBodyCell>{determine_status(item)}</TableBodyCell>
				</TableBodyRow>
			
			{/each}
		</TableBody>
	</TableSearch>

	<Pagination {pages} on:previous={previous} on:next={next} /> 
</div>
<!-- <Button color="dark" class="relative r-5 b-5 p-1 rounded">
	<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    	<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
	</svg>
</Button> -->
