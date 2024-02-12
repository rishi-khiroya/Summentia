<script lang="ts">
	import { page } from '$app/stores';
	import { AccordionItem, Accordion, Fileupload, Button, Spinner, Input } from 'flowbite-svelte';
	import LectureUpload from './LectureUpload.svelte';
	import Customisation from './Customisation.svelte';

	let waiting: boolean = false;

	let title: string;
	let date: Date;

	let doLectureUpload = false;
	let lectureURL: string;
	let lectureFileList: FileList;

	let supplementary: { 
		slides: FileList | undefined, 
		extras: FileList | undefined
	} = { 
		slides: undefined, 
		extras: undefined 
	}

	let customisation: Customisation = {
		highlightKeywords: false,
		questions: false,
		summaryFormat: "",
		noPages: 1
	}

	async function submit() {
		const form = new FormData();

		form.append('userId', $page.data.session.user.id);

		form.append('isLectureFile', doLectureUpload.toString());
		if (doLectureUpload) {
			if (lectureFileList && lectureFileList.length) {
				form.append('lectureFile', lectureFileList[0]);
			}
		} else form.append('lectureURL', lectureURL);

		form.append('customisation', JSON.stringify(customisation));

		if (supplementary.slides?.length) form.append('slides', supplementary.slides)
		form.append('noSupplementary', supplementary.length);
		supplementaryFiles.forEach((file, i) => {
			form.append(`supplementary${i}`, file);
		});

		waiting = true;
		const response: Response = await fetch('?/submit', {
			method: 'POST',
			body: form
		});

		const data = JSON.parse((await response.json()).data);
		waiting = false;
	}
</script>

<div class="flex-1 p-5">
	<div class="flex-1">
		<Accordion>
			<AccordionItem>
				<span slot="header">Info</span>
				<div class="flex flex-row justify-between">
					<div>
						<span>Title</span>
						<Input type="text" bind:title placeholder="My Lecture..."/>
					</div>
					<div>
						<span>Date</span>
						<Input type="date" bind:date />
					</div>
				</div>
			</AccordionItem>
			<AccordionItem open>
				<span slot="header">Upload Lecture</span>
				<LectureUpload bind:fileList={lectureFileList} bind:doLectureUpload bind:lectureURL />
			</AccordionItem>
			<AccordionItem>
				<span slot="header">Upload Slides</span>
				<Fileupload on:change={event => supplementary.slides = event.target.files}/>
			</AccordionItem>

			<AccordionItem>
				<span slot="header">Add Supplementary Info</span>
				<Fileupload multiple on:change={event => supplementary.extras = event.target.files} />
			</AccordionItem>
			<AccordionItem>
				<span slot="header">Customisation</span>
				<Customisation bind:customisation />
			</AccordionItem>
		</Accordion>
	</div>
	<div style="display: flex; justify-content: flex-end;">
		{#if waiting}
			<Button color="dark" class="m-5 p-4">
				<Spinner class="me-3" size="4" color="white" />
				Loading ...
			</Button>
		{:else}
			<Button type="submit" on:click={() => submit()} color="dark" class="text-white m-5 p-4"
				>Submit</Button
			>
		{/if}
	</div>
</div>
