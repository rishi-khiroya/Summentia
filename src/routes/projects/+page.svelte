<script lang="ts">
  	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Pagination, Button } from 'flowbite-svelte';
	import { page } from '$app/stores';

	export let data;

	const NO_PAGES: number = 5;
	let searchTerm: string = ''
  	$: filteredItems = data.projects.filter((project) => project.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

	let pages = Array.from( { 
		length: NO_PAGES 
	}, (value, index) => data.pageNo - Math.min(2, data.pageNo - 1) + index).
		filter((id: number) => id <= Math.max(1, Math.ceil(data.noProjects / NO_PAGES))).
		map((id: number) => { return {
			name: id,
			href: `/projects?page=${id}`,
			active: id === data.pageNo
		}});

	const determine_status = (project): string => {
		if (project.summary) return "Summarised"
		if (project.transcript) return "Transcribed"
		return "Unprocessed"
	}

	const previous = () => {
		goto(`?${new URLSearchParams($page.url.searchParams.toString()).set('page', Math.max(pageNo - 1, 1)).toString()}`)
	};
	const next = () => {
		goto(`?${new URLSearchParams($page.url.searchParams.toString()).set('page', Math.min(pageNo + 1, data.noProjects)).toString()}`)
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
			<TableBodyRow>
			<!-- <TableBodyCell>{item.id}</TableBodyCell> -->
			<TableBodyCell>{item.title}</TableBodyCell>
			<TableBodyCell>{item.date}</TableBodyCell>
			<TableBodyCell>{item.createdAt}</TableBodyCell>
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