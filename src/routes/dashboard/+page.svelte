<script lang="ts">
    import { Badge, ListPlaceholder, Hr, Button, ImagePlaceholder, TableBody, TableBodyRow, TableBodyCell, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    import { ArrowRightOutline,  ArrowDownToBracketOutline, PlusSolid} from 'flowbite-svelte-icons';
	import { reformat_date } from '$lib/utils.js';
    import { goto } from '$app/navigation';

	export let data;

    const NR_RECENT_PROJECTS = 5;
    let searchTerm: string = '';
    const recent_projects = data.projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, NR_RECENT_PROJECTS);
    $: filteredItems = recent_projects.filter(
		(project) => project.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

    function nav_to_project_page(project_id:number) {
	console.log(project_id)
	goto('projects/' + project_id.toString());
	};
	
</script>

<div class="flex flex-col p-10">
    <h1 class="text-4xl p-10 font-bold">Dashboard</h1>
    <div class="flex space-x-10 py-5">
        <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
            <h2 class="text-xl px-2 font-semibold">Your most recent summary:</h2>
            <div class="flex space-x-5 py-3">
                <Badge rounded large color="dark" class="w-55 h-19"> 
                    <div> <h1>{recent_projects[0].title}</h1> 
                        <h3>{reformat_date(recent_projects[0].createdAt)}</h3></div>
                    
                </Badge>
                <Button color="blue" size="sm">
                    <ArrowDownToBracketOutline />
                    Downolad Summary
                </Button>
            
            </div>
            <ImagePlaceholder alt="sample 1" />
            <h3> {recent_projects[0].data.summary}</h3>
            <div class="space-x-5 py-3">
                <Button color="primary"> Edit </Button>
                <Button color="red"> Delete </Button>
            </div>
        </div>
        
        <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl p-10 space-y-3 justify-center align-top">
            <h2 class="text-xl px-2 font-semibold">Recent Projects:</h2>
        <TableSearch placeholder="Search by project title" hoverable={true} bind:inputValue={searchTerm}>
            <TableHead>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Created At</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each filteredItems as item}
            
                    <TableBodyRow on:click={nav_to_project_page(item.id)}>
                        <!-- <TableBodyCell>{item.id}</TableBodyCell> -->
                        <TableBodyCell>{item.title}</TableBodyCell>
                        <TableBodyCell>{reformat_date(item.createdAt)}</TableBodyCell>
                    </TableBodyRow>
                
                {/each}
            </TableBody>
        </TableSearch>
            <p class="underline text-right font-medium text-gray-600 px-3"><a href="/projects">All Projects <ArrowRightOutline class="w-3.5 h-3.5 ms-2" /></a><p>
        
        </div>
    </div>
</div>
