<script lang="ts">
	import { Dropzone, Input, Toggle } from 'flowbite-svelte';
	import type { Upload } from './(types)/Upload';

	let uploadFile: File[] = [];

	export let name: string;

	export let allowedFileType: string;

	export let upload: Upload = {
		fromFile: false,
		url: '',
		fileList: undefined
	};

	const dropHandle = (event: any) => {
		uploadFile = [];
		event.preventDefault();
		if (event.dataTransfer.items) {
			[...event.dataTransfer.items].forEach((item) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					uploadFile.push(file.name);
					uploadFile = uploadFile;
				}
			});
		} else {
			[...event.dataTransfer.files].forEach((file) => {
				uploadFile = file.name;
			});
		}
	};

	const handleChange = (event: any) => {
		const files = event.target.files;
		if (files.length > 0) {
			uploadFile.push(files[0].name);
			uploadFile = uploadFile;
		}
		upload.fileList = files;
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
	<p class="pr-3 dark:text-white">{name} from File</p>
	<Toggle checked on:change={() => (upload.fromFile = !upload.fromFile)} />
	<p class="pl-0 dark:text-white">{name} from URL</p>
</div>
<div class="flex-1">
	{#if upload.fromFile}
		<Dropzone
			on:drop={dropHandle}
			on:dragover={(event) => {
				event.preventDefault();
			}}
			on:change={handleChange}
		>
			{#if uploadFile.length === 0}
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
				<p class="text-xs text-gray-500 dark:text-gray-400">{allowedFileType} files only</p>
			{:else}
				<p>{showFiles(uploadFile)}</p>
			{/if}
		</Dropzone>
	{:else}
		<span class="px-1 dark:text-white">URL:</span>
		<Input type="url" placeholder="Enter lecture URL" bind:value={upload.url} />
	{/if}
</div>
