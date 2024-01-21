<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
    import LectureUpload from './(components)/LectureUpload.svelte';
	import { fromJSON } from 'postcss';
	import SlidesUpload from './(components)/SlidesUpload.svelte';

	let lectureFile:File = [];
	let doLectureUpload = false;
	let lectureURL: string;
	let slidesFile: File[] = [];

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
		form.append('slidesFile', slidesFile);
	}
</script>

<div class="flex-1 p-5">
	
	<div class="flex-1">
		<Accordion>
		  <AccordionItem>
			<span slot="header">Upload Lecture</span>
			<LectureUpload bind:lectureFile bind:doLectureUpload bind:lectureURL />
		  </AccordionItem>
		  <AccordionItem>
			<span slot="header">Upload Slides</span>
			<SlidesUpload bind:slidesFile />
		  </AccordionItem>
		
		  <AccordionItem>
			<span slot="header">Supplementary Info</span>
			
		  </AccordionItem>
		  <AccordionItem>
			<span slot="header">Customisation</span>
			
		  </AccordionItem>
		</Accordion>
		</div>
	<Button type="submit" on:click={() => submit()} color="dark" class="text-white m-5 p-4"
		>Submit</Button
	>
</div>
