<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import LectureUpload from './(components)/LectureUpload.svelte';

	let lectureFile: File[] = [];
	let doLectureUpload = false;
	let lectureURL: string;

	async function submit() {
		const form = new FormData();

		form.append('isLectureFile', doLectureUpload);
		if (doLectureUpload) {
			form.append('noLectureFiles', lectureFile.length);
			lectureFile.forEach((file, i) => {
				form.append(`lectureFile${i}`, file);
			});
		} else form.append('lectureURL', lectureURL);

		const response = await fetch('?/submit', {
			method: 'POST',
			body: form
		});
	}
</script>

<div class="sticky flex flex-row justify-center top-0 p-5">
	<h1 class="text-5xl text-center font-sans rounded-lg p-8 px-28 bg-slate-200">Summentia</h1>
</div>

<div class="flex-1 p-5">
	<LectureUpload bind:lectureFile bind:doLectureUpload bind:lectureURL />
</div>

<Button type="submit" on:click={() => submit()} color="dark" class="text-white m-5 p-4"
	>Submit</Button
>
