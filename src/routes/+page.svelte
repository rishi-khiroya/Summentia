<script lang="ts">
    
    import { Dropzone } from 'flowbite-svelte';
    import { Button, Label, Fileupload } from 'flowbite-svelte';


    let lectureFile = [];
    const dropHandle = (event) => {
    lectureFile = [];
    event.preventDefault();
    if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                lectureFile.push(file.name);
                lectureFile = lectureFile;
            }
        });
    } else {
        [...event.dataTransfer.files].forEach((file, i) => {
            lectureFile = file.name;
        });
    }
    };

    const handleChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            lectureFile.push(files[0].name);
            lectureFile = lectureFile;
        }
    };

    const showFiles = (files) => {
        if (files.length === 1) return files[0];
        let concat = '';
        files.map((file) => {
            concat += file;
            concat += ',';
            concat += ' ';
        });

        if (concat.length > 40) concat = concat.slice(0, 40);
        concat += '...';
        return concat;
    };

    let path;

</script>

<div class="sticky flex flex-row justify-center top-0 p-5">
    <h1 class="text-5xl text-center font-sans rounded-lg p-8 px-28 bg-slate-200">Summentia</h1>
</div>

<div class="flex flex-col columns-2 px-10 py-10 space-y-2">
<!-- 
    <form method="POST" action="?/transcribe" enctype="multipart/form-data">
        <h1 class="text-lg">Upload Lecture:</h1> -->

        <!-- <Label class="space-y-2 mb-2">
            <span>Upload file</span>
            <Fileupload id="path" bind:path required/>
        </Label> -->

        <!-- <input type="file" id="file" use:enhance name="file"/> -->

        
        <!-- <Dropzone
            on:drop={dropHandle}
            on:dragover={(event) => {
                event.preventDefault();
            }}
            on:change={handleChange}>
        {#if lectureFile.length === 0}

            <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        {:else}
            <p>{showFiles(lectureFile)}</p>
        {/if}
        </Dropzone> -->
<!-- 
        <Button type="submit" color="dark" class="text-white m-5 p-4">Transcribe</Button>

    </form> -->



    <form method="post" use:enhance enctype="multipart/form-data" action="?/transcribe">

        <div class="group">
        <label for="file">Upload your file</label>
        <input
            type="file"
            id="file"
            name="fileToUpload"
            required
        />
        </div>
        <button type="submit">Submit</button>
    
    </form>
    
    
    

</div>