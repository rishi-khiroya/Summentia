<script lang="ts">
    import { Badge, ListPlaceholder, TextPlaceholder, Hr, Button, ImagePlaceholder } from 'flowbite-svelte';
    import { ArrowRightOutline,  ArrowDownToBracketOutline, PlusSolid} from 'flowbite-svelte-icons';

</script>

<div class="flex flex-col p-10">
    <h1 class="text-4xl p-10 font-bold">Dashboard</h1>
    <div class="flex space-x-10 py-5">
        <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
            <h2 class="text-xl px-2 font-semibold">Your most recent summary:</h2>
            <div class="flex space-x-5 py-3">
                <Badge rounded large color="dark" class="w-55 h-19"> 
                    <div> <h1>Title</h1> 
                        <h3>Last Modified:</h3></div>
                    
                </Badge>
                <Button color="blue" size="sm">
                    <ArrowDownToBracketOutline />
                    Downolad Summary
                </Button>
            
            </div>
            <ImagePlaceholder alt="sample 1" />
            
            <div class="space-x-5 py-3">
                <Button color="primary"> Edit </Button>
                <Button color="red"> Delete </Button>
            </div>
        </div>
        <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
            <h2 class="text-xl px-2 font-semibold">Recent Projects:</h2>
            <Hr /> 
            <ListPlaceholder />
            <Hr /> 
            <p class="underline text-right font-medium text-gray-600 px-3"><a href="/projects">All Projects <ArrowRightOutline class="w-3.5 h-3.5 ms-2" /></a><p>
        </div>
        <div class="bottom"><Button color="blue"> <PlusSolid /> New Project </Button></div>
        
    </div>
</div>
