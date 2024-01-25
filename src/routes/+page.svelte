<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import LectureUpload from './(components)/LectureUpload.svelte';

	let doLectureUpload = false;
	let lectureURL: string;
	let fileList: FileList;

	async function submit() {
		const form = new FormData();

		form.append('isLectureFile', doLectureUpload.toString());
		if (doLectureUpload) {
			if (fileList && fileList.length) {
				form.append('lectureFile', fileList[0]);
			}
		} else form.append('lectureURL', lectureURL);

		const response = await fetch('?/submit', {
			method: 'POST',
			body: form
		});
	}
</script>

<div class="flex-1 p-5">
	<LectureUpload bind:doLectureUpload bind:lectureURL bind:fileList />

	<Button type="submit" on:click={submit} color="dark" class="text-white m-5 p-4">Submit</Button>
</div>
