<script lang="ts">
	import { Input, Label, Checkbox, Radio } from 'flowbite-svelte';

	export let nrOfPages: number;
	export let areKeyWordsHighlighted: boolean;
	export let typeOfSummary: string;
	export let hasQandAns: boolean;
</script>

<div class="customization">
	<div>
		<Label for="number_pages" class="mb-2">Enter max number of pages for the summary</Label>
		<Input
			type="number"
			id="nr-pages"
			placeholder="Max Number of Pages"
			required
			bind:value={nrOfPages}
		/>
	</div>
	<Checkbox checked={areKeyWordsHighlighted}>Highlight Key Words</Checkbox>
	<div>
		<Label for="summary-types" class="mb-2">Types of Summary:</Label>
		<Radio name="type" value={''} bind:group={typeOfSummary}>Text Format</Radio>
		<Radio name="type" value={' as bullet points'} bind:group={typeOfSummary}>Bullet Points</Radio>
	</div>
	<div>
		<Label for="extra-features" class="mb-2">Extra Features:</Label>
		<Checkbox checked={hasQandAns}>Generate Questions and Answers</Checkbox>
	</div>
</div>

<style>
	.customization {
		display: flex;
		flex-direction: column;
		gap: 1em;
		height: 100%;
		perspective: 100vh;
	}
</style>
