<script lang="ts">
	import { Dropzone, Input, Toggle } from 'flowbite-svelte';

	export let lectureFile: File[];
    export let doLectureUpload: boolean;
    export let lectureURL: string;

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

	const showFiles = (files: Blob[]) => {
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
</script>

<div class="flex py-3">
	<!-- TODO: improve wording -->
	<p class="pr-3">Upload Lecture</p>
	<Toggle checked on:change={() => (doLectureUpload = !doLectureUpload)} />
	<p class="pl-0">Lecture From URL</p>
</div>
<div class="flex-1">
	{#if doLectureUpload}
		<h1 class="text-lg">Upload Lecture:</h1>

		<Dropzone
			on:drop={dropHandle}
			on:dragover={(event) => {
				event.preventDefault();
			}}
			on:change={handleChange}
		>
			{#if lectureFile.length === 0}
				<svg
					aria-hidden="true"
					class="mb-3 w-10 h-10 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/></svg
				>
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					<span class="font-semibold">Click to upload</span> or drag and drop
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					SVG, PNG, JPG or GIF (MAX. 800x400px)
				</p>
			{:else}
				<p>{showFiles(lectureFile)}</p>
			{/if}
		</Dropzone>
	{:else}
		<h1 class="text-lg">Upload from URL:</h1>
		<Input type="url" placeholder="Enter lecture URL" bind:value={lectureURL}/>
	{/if}
</div>
