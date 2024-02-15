<script lang="ts">
	import FormStep from './FormStep.svelte';
	import { StepStatus, type Step } from './(types)/Step';
	import ProgressIndicator from './ProgressIndicator.svelte';
	import { Input } from 'flowbite-svelte';
	import FileUpload from './FileUpload.svelte';
	import type { Upload } from './(types)/Upload';
	import { goto } from '$app/navigation';

	export let data;

	let currentStep: number = -1;

	let steps: Step[] = [
		{
			id: 0,
			name: 'Lecture',
			required: true,
			populated: false,
			status: StepStatus.UNSEEN
		},
		{
			id: 1,
			name: 'Slides',
			required: false,
			populated: false,
			status: StepStatus.UNSEEN
		},
		{
			id: 2,
			name: 'Info',
			required: true,
			populated: false,
			status: StepStatus.UNSEEN
		}
	];

	$: {
		if (currentStep == steps.length) currentStep = -1;
		if (currentStep < -1) currentStep = steps.length - 1;
	}

	let lectureUpload: Upload;

	let info: {
		title: string;
		date: string;
	} = { title: 'Test', date: '2024-02-14' };

	let slidesUpload: Upload;
</script>

<div class="flex flex-col p-5 m-10 bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
	<ProgressIndicator bind:currentStep bind:steps />

	<!-- Upload Lecture -->
	<FormStep
		bind:step={steps[0]}
		bind:currentStep
		isPopulated={() => (lectureUpload.fromFile ? !!lectureUpload.fileList : !!lectureUpload.url)}
	>
		<h1 class="text-2xl font-bold dark:text-white">Upload lecture:</h1>
		<FileUpload bind:upload={lectureUpload} name="Lecture" allowedFileType=".mp4" />
	</FormStep>

	<!-- Upload Slides (maybe) -->
	<FormStep
		step={steps[1]}
		bind:currentStep
		isPopulated={() => (slidesUpload.fromFile ? !!slidesUpload.fileList : !!slidesUpload.url)}
	>
		<h1 class="text-2xl font-bold dark:text-white">Upload slides:</h1>
		<FileUpload bind:upload={slidesUpload} name="Slides" allowedFileType=".pdf, .pptx" />
	</FormStep>

	<!-- Confirm title and date (guessed from lecture/slides) -->
	<FormStep step={steps[2]} bind:currentStep isPopulated={() => !!info.date && !!info.title}>
		<h1 class="text-2xl font-bold dark:text-white">Project Information:</h1>
		<div class="flex flex-col space-y-3">
			<h1 class="font-semibold dark:text-white">Please verify the following:</h1>
			<div class="flex flex-row space-x-5 px-5">
				<div class="w-full p-3 mx-5">
					<span class="dark:text-white p-1">Title:</span>
					<Input type="text" bind:value={info.title} placeholder="My Lecture..." />
				</div>
				<div class="w-full p-3 mx-5">
					<span class="dark:text-white p-1">Date:</span>
					<Input type="date" bind:value={info.date} />
				</div>
			</div>
			<!-- TODO: potentially add a preview of the video here -->
		</div>
	</FormStep>

	<!-- Review and submit -->
	<FormStep
		step={{
			id: -1,
			name: 'Submit',
			required: true,
			status: StepStatus.UNSEEN,
			populated: false
		}}
		bind:currentStep
		submit={() => {
			goto('dashboard'); // TODO: change to a progress page or something like that
			return { success: true, msg: undefined };
		}}
	>
		<h1 class="text-2xl font-bold dark:text-white">Review & Submit:</h1>
		<p class="p-5">Blah blah some stuff ...</p>
		<!-- TODO -->
		{#if !data.session?.user}
			<h1 class="font-medium text-orange-600">
				Warning: you are not logged in. This project will not be accessible again.
			</h1>
		{/if}
	</FormStep>
</div>
