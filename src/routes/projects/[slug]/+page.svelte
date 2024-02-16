<script lang="ts">
    import { Button, Dropdown, DropdownItem, VideoPlaceholder, TextPlaceholder, CardPlaceholder} from 'flowbite-svelte';
    import { EditSolid, DownloadSolid, AngleDownSolid } from 'flowbite-svelte-icons';
    import InformationBox from './InformationBox.svelte'

</script>

<div class="max-h-screen flex-1">
    <div class="flex-col px-10 pt-10">
        <div class="justify-start items-center flex">
            <Button class="h-10 w-10" pill={true} color="dark"><EditSolid /></Button>
            <h1 class="text-4xl p-5 font-bold">Intro to IML video</h1>
            <Button class="z-0" pill={false} color="dark"><DownloadSolid class="me-2"/>Download Summary</Button>
            <Button class="border-l border-gray-500 w-5 relative -left-3 z-10 focus-within:ring-0 focus:ring-0" pill={false} color="dark">
                <AngleDownSolid class="focus:!outline-none"></AngleDownSolid>
            </Button>
            <Dropdown>
                <DropdownItem>.pdf</DropdownItem>
                <DropdownItem>.docx</DropdownItem>
                <DropdownItem>.txt</DropdownItem>
            </Dropdown>
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