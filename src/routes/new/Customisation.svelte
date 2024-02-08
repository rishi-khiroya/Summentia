<script lang="ts">
	import { Input, Label, Checkbox, Radio } from 'flowbite-svelte';

	export let customisation: Customisation;
</script>

<div class="customization">
	<div>
		<Label for="number_pages" class="mb-2">Enter max number of pages for the summary</Label>
		<Input
			type="number"
			id="nr-pages"
			placeholder="1 (default)"
			bind:value={customisation.no_pages}
		/>
	</div>
	<Checkbox checked={customisation.highlight_keywords}>Highlight Key Words</Checkbox>
	<div>
		<Label for="summary-types" class="mb-2">Types of Summary:</Label>
		<Radio name="type" value={''} bind:group={customisation.summary_format}>Text Format</Radio>
		<Radio name="type" value={' as bullet points'} bind:group={customisation.summary_format}>Bullet Points</Radio>
	</div>
	<div>
		<Label for="extra-features" class="mb-2">Extra Features:</Label>
		<Checkbox checked={customisation.questions}>Generate Questions and Answers</Checkbox>
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
