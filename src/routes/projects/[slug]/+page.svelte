<script lang="ts">
    import { EditSolid, DownloadSolid, AngleDownSolid } from 'flowbite-svelte-icons';
    import InformationBox from './InformationBox.svelte'
    import { 
        ButtonGroup, 
        Button, 
        Dropdown, 
        DropdownItem, 
        VideoPlaceholder, 
        TextPlaceholder, 
        CardPlaceholder
    } from 'flowbite-svelte';
</script>

<div class="max-h-screen flex-1">
    <div class="flex-col px-10 pt-10">
        <div class="justify-start items-center flex">
            <Button class="h-10 w-10" pill={true} color="dark"><EditSolid class="focus:!outline-none" /></Button>
            <h1 class="text-4xl p-5 font-bold">Intro to IML video</h1>
            <ButtonGroup>
                <Button pill color="dark"><DownloadSolid class="me-2 focus:!outline-none"/>Download Summary</Button>
                <Button class="border-l border-gray-500 w-5" pill={false} color="dark">
                    <AngleDownSolid class="focus:!outline-none"></AngleDownSolid>
                </Button>
                <Dropdown>
                    <DropdownItem>.pdf</DropdownItem>
                    <DropdownItem>.docx</DropdownItem>
                    <DropdownItem>.txt</DropdownItem>
                </Dropdown>
            </ButtonGroup>
        </div>
        <div class="flex">
            <div class="flex-col flex-1">
                <InformationBox title="Transcript" maxHeight="80">
                    <TextPlaceholder size="xxl" />
                </InformationBox>
                <VideoPlaceholder size="xxl" class="m-5" />
            </div>
            <InformationBox title="Preview:" maxHeight="[650px]" additionalAttributes="flex-1 min-h-[600px]">
            <CardPlaceholder size="xxl" />
            </InformationBox>
        </div>
    </div>
</div>