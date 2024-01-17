<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import MainAccordion from './(components)/MainAccordion.svelte';

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

<div class="flex-1 p-5">
	
	<MainAccordion />

	<Button type="submit" on:click={() => submit()} color="dark" class="text-white m-5 p-4"
		>Submit</Button
	>
</div>
