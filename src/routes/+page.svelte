<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import LectureUpload from './(components)/LectureUpload.svelte';
	import SlidesUpload from './(components)/SlidesUpload.svelte';
	import SupplementaryUpload from './(components)/SupplementaryUpload.svelte';
	import Customisation from './(components)/Customisation.svelte';

	let doLectureUpload = false;
	let lectureURL: string;
	let lectureFileList: FileList;
	let slidesFile: File;
	let supplementaryFiles: File[] = [];
	let nrOfPages: number;
	let areKeyWordsHighlighted: boolean;
	let typeOfSummary: string;
	let hasQandAns: boolean;

	async function submit() {
		const form = new FormData();

		form.append('isLectureFile', doLectureUpload.toString());
		if (doLectureUpload) {
			if (lectureFileList && lectureFileList.length) {
				form.append('lectureFile', lectureFileList[0]);
			}
		} else form.append('lectureURL', lectureURL);
		form.append('slidesFile', slidesFile);
		supplementaryFiles.forEach((file, i) => {
			form.append(`supplementaryFiles${i}`, file);
		});

		form.append('nrOfPages', nrOfPages?.toString());
		form.append('areKeyWordsHighlighted', areKeyWordsHighlighted?.toString());
		form.append('typeOfSummary', typeOfSummary);
		form.append('hasQandAns', hasQandAns?.toString());

		const response = await fetch('?/submit', {
			method: 'POST',
			body: form
		});
	}
</script>

<div class="flex-1 p-5">
	<div class="flex-1">
		<Accordion>
			<AccordionItem>
				<span slot="header">Upload Lecture</span>
				<LectureUpload bind:fileList={lectureFileList} bind:doLectureUpload bind:lectureURL />
			</AccordionItem>
			<AccordionItem>
				<span slot="header">Upload Slides</span>
				<SlidesUpload bind:slidesFile />
			</AccordionItem>

			<AccordionItem>
				<span slot="header">Add Supplementary Info</span>
				<SupplementaryUpload bind:supplementaryFiles />
			</AccordionItem>
			<AccordionItem>
				<span slot="header">Customisation</span>
				<Customisation
					bind:nrOfPages
					bind:areKeyWordsHighlighted
					bind:typeOfSummary
					bind:hasQandAns
				/>
			</AccordionItem>
		</Accordion>
	</div>
	<div style="display: flex; justify-content: flex-end;">
		<Button type="submit" on:click={() => submit()} color="dark" class="text-white m-5 p-4"
			>Submit</Button
		>
	</div>
</div>
