<script lang="ts">
    import InformationBox from './InformationBox.svelte'
    import { goto } from '$app/navigation';
    import { 
        EditSolid, 
        DownloadSolid, 
        AngleDownSolid, 
        ChevronLeftOutline, 
        ChevronRightOutline 
    } from 'flowbite-svelte-icons';
    import { 
        ButtonGroup, 
        Button, 
        Dropdown, 
        DropdownItem, 
        ImagePlaceholder,
        VideoPlaceholder, 
        TextPlaceholder, 
        CardPlaceholder,
        Pagination
    } from 'flowbite-svelte';

    export let data;

    let displaySlides = data.project.hasSlides;
    $: displayButtonText = displaySlides ? "Slides View" : "Overview";
    let pages: { name: string, href: string }[];

    if (displaySlides) {
        // TODO: Convert slideData into PrismaSlidesData object and determine pages
        let slideData = data.project.data;
        pages = [
            { name: "1", href: "/projects/1?page=1" },
            { name: "3", href: "/projects/1?page=3" },
            { name: "2", href: "/projects/1?page=2" },
            { name: "4", href: "/projects/1?page=4" },
            { name: "5", href: "/projects/1?page=5" }
        ]
    }

    const downloadOptionPressed = (e: MouseEvent) => {
        let option = e.target?.textContent ?? "unknown";
        alert(`Download option ${option} pressed`);
    };

    const changeView = () => {
        displaySlides = !displaySlides;
    };

    const previous = () => {
        alert('Previous btn clicked. Make a call to your server to fetch data.');
    };
    const next = () => {
        alert('Next btn clicked. Make a call to your server to fetch data.');
    };
    function edit() {
        goto('slide_editor/' + data.project.id.toString());
    }

</script>

<div class="flex-1">
    <div class="flex-col px-10 pt-10">
        <div class="flow-root">
            <div class="float-left justify-start items-center flex">
                <!-- TODO: Link button to edit page -->
                <Button class="h-10 w-10" pill color="dark" href="/projects"><EditSolid class="focus:!outline-none" /></Button>
                <h1 class="text-4xl p-5 font-bold">{data.project.title}</h1>
                <ButtonGroup>
                    <Button pill color="dark"><DownloadSolid class="me-2 focus:!outline-none"/>Download Summary</Button>

                    <Button class="border-l border-gray-500 w-5" color="dark">
                        <AngleDownSolid class="focus:!outline-none"></AngleDownSolid>
                    </Button>
                    <Dropdown>
                        <div slot="header">
                            <span class="font-medium py-2 px-4 text-md">Summary File Type</span>
                        </div>
                        <DropdownItem on:click={downloadOptionPressed}>.pdf</DropdownItem>
                        <DropdownItem on:click={downloadOptionPressed}>.tex</DropdownItem>
                        <DropdownItem on:click={downloadOptionPressed}>.doc</DropdownItem>
                        <DropdownItem on:click={downloadOptionPressed}>.txt</DropdownItem>
                    </Dropdown>
                </ButtonGroup>
                <div class="float-left justify-start items-center flex p-10">
                    <Button color="dark" size="lg" on:click={edit}>Edit Summary</Button>
                </div>
            </div>
            {#if data.project.hasSlides}
                <div class="float-right justify-end items-center flex">
                    <Button pill color="dark" on:click={changeView}>{displayButtonText}</Button>
                </div>
            {/if}
        </div>
        {#if displaySlides}
            <div class="grid grid-rows-2 grid-flow-col gap-0">
                <VideoPlaceholder size="xxl" class="m-5" />
                <ImagePlaceholder imgHeight="72" class="m-5" />
                <InformationBox title="Transcript:" maxHeight="72">
                    <TextPlaceholder size="xxl" />
                </InformationBox>
                <InformationBox title="Summary:" maxHeight="72">
                    <TextPlaceholder size="xxl" />
                </InformationBox>
            </div>
            <div class="flex justify-center">
                <Pagination {pages} large on:previous={previous} on:next={next} icon>
                    <svelte:fragment slot="prev">
                        <span class="sr-only">Previous</span>
                        <ChevronLeftOutline class="w-7 h-7" />
                    </svelte:fragment>
                    <svelte:fragment slot="next">
                        <span class="sr-only">Next</span>
                        <ChevronRightOutline class="w-7 h-7" />
                    </svelte:fragment>
                </Pagination>
            </div>
        {:else}
            <div class="flex">
                <div class="flex-col flex-1">
                    <InformationBox title="Transcript:" maxHeight="80">
                        <TextPlaceholder size="xxl" />
                    </InformationBox>
                    <VideoPlaceholder size="xxl" class="m-5" />
                </div>
                <InformationBox title="Summary:" maxHeight="[650px]" additionalAttributes="flex-1 min-h-[600px]">
                <CardPlaceholder size="xxl" />
                </InformationBox>
            </div>
        {/if}
    </div>
</div>