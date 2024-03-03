<script lang="ts">
	import { Button, Checkbox, Hr, Input, Label, Modal, Radio } from 'flowbite-svelte';
	import { type Customisation as CustomisationObj } from '$lib/types/Customisation';
	import { DIGITAL_OCEAN_SUMMARIES_ENDPOINT } from '$lib/object_storage/static';

	export let open: boolean;
	export let customisation: CustomisationObj;
	export let filename: string;

	let outputType: string;

	async function download() {
		if (!outputType) return;

		const form = new FormData();
		form.append('type', outputType);
		form.append('filename', filename);

		const response = await fetch(`?/download`, {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			const url = `${DIGITAL_OCEAN_SUMMARIES_ENDPOINT}/${filename}.${outputType}`;
			
			let link = document.createElement('a');

			link.href = url;
			link.click();
		}
	}
</script>

<Modal title="Download" bind:open autoclose outsideclose class="flex flex-col">
	<div class="flex flex-col w-full space-y-3">
		<div>
			<Label for="number_pages" class="mb-2">Enter max number of pages for the summary</Label>
			<Input
				type="number"
				id="nr-pages"
				placeholder="1 (default)"
				bind:value={customisation.length}
			/>
		</div>
		<Checkbox checked={customisation.highlight_keywords}>Highlight Key Words</Checkbox>
		<div>
			<Label for="summary-types" class="mb-2">Types of Summary:</Label>
			<Radio name="type" value={''} bind:group={customisation.summary_format}>Text Format</Radio>
			<Radio name="type" value={' as bullet points'} bind:group={customisation.summary_format}
				>Bullet Points</Radio
			>
		</div>
		<div>
			<Label for="extra-features" class="mb-2">Extra Features:</Label>
			<Checkbox checked={customisation.questions}>Generate Questions and Answers</Checkbox>
		</div>
	</div>
	<Hr />
	<div class="flex flex-col w-full">
		<h1 class="mb-4 font-semibold text-black dark:text-white">Download Format</h1>
		<ul
			class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
		>
			<li class="w-full">
				<Radio bind:group={outputType} value={'pdf'} class="p-3">.pdf</Radio>
			</li>
			<li class="w-full">
				<Radio bind:group={outputType} value={'txt'} class="p-3">.txt</Radio>
			</li>
			<li class="w-full">
				<Radio bind:group={outputType} value={'tex'} class="p-3">.tex</Radio>
			</li>
			<li class="w-full">
				<Radio bind:group={outputType} value={'docx'} class="p-3">.docx</Radio>
			</li>
		</ul>
	</div>
	<svelte:fragment slot="footer">
		<div class="flex w-full justify-end">
			<Button on:click={() => download()}>Download</Button>
		</div>
	</svelte:fragment>
</Modal>
