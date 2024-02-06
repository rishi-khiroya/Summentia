<script lang="ts">
    import { ListPlaceholder, TextPlaceholder, Hr } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<div class="flex flex-col p-10">
    <h1 class="text-4xl p-10 font-bold">Dashboard</h1>
    <div class="flex space-x-10 py-5">
        <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
            <TextPlaceholder size="xl" class="mt-8" />
        </div>
        <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
            <h2 class="text-xl px-2 font-semibold">Recent Projects:</h2>
            <Hr /> 
            <ListPlaceholder />
            <Hr /> 
            <p class="underline text-right font-medium text-gray-600 px-3"><a href="/projects">All Projects <ArrowRightOutline class="w-3.5 h-3.5 ms-2" /></a><p>
        </div>
    </div>
</div>
