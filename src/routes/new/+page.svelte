<script lang="ts">
	import FormStep from './FormStep.svelte';
	import { StepStatus, type Step } from './(types)/Step';
	import ProgressIndicator from './ProgressIndicator.svelte';
	import { Input, Label, Spinner, Range, Toggle } from 'flowbite-svelte';
	import FileUpload from './FileUpload.svelte';
	import type { Upload } from './(types)/Upload';
	import { goto } from '$app/navigation';
	import { formResponseToJSON } from '$lib/utils';

	export let data;

	let currentStep: number = 0;
	let waiting: boolean = false;

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

	let lecture: {
		video: string;
		slides: string;
		userId: string;
		info: { title: string; date: string };
		customisation: { summaryLevel: number, questions: boolean };
	};

	let slidesUpload: Upload;

	// Stop the page from refreshing without confirmation of losing data.
	function beforeUnload(event: BeforeUnloadEvent): string {
		event.preventDefault();
		event.returnValue = '';
		return '';
	}

	async function handleLecture(): Promise<{ success: boolean; msg: string | undefined }> {
		const form: FormData = new FormData();

		// Add userId to the form
		if (data.session) form.append('userId', data.session.user.id);

		// Add lecture to the form
		form.append('lectureFromFile', lectureUpload.fromFile.toString());
		if (lectureUpload.fromFile && lectureUpload.fileList?.length)
			form.append('lectureFile', lectureUpload.fileList[0]);
		else form.append('lectureURL', lectureUpload.url);

		waiting = true;

		const response: Response = await fetch('?/extractInfo', {
			method: 'POST',
			body: form
		});

		if (!response.ok) {
			waiting = false;
			console.log(response.statusText);
			return { success: false, msg: response.statusText };
		}

		const json = await response.json();
		const responseData: {
			success: boolean;
			error: string | undefined;
			lecture: {
				video: string;
				slides: string;
				userId: string;
				info: { title: string; date: string };
			};
		} = formResponseToJSON(json.data.toString());

		waiting = false;

		if (responseData.success) {
			lecture = JSON.parse(responseData.lecture.toString());
			return { success: true, msg: undefined };
		} else return { success: false, msg: responseData.error };
	}

	async function handleSlides(): Promise<{ success: boolean; msg: string | undefined }> {
		if (slidesUpload.fromFile ? !slidesUpload.fileList : !slidesUpload.url)
			return { success: false, msg: "Error: 'submit' should not have been called for a skip." };

		const form: FormData = new FormData();

		form.append('lecture', JSON.stringify(lecture));

		// Add slides to the form
		form.append('slidesFromFile', slidesUpload.fromFile.toString());
		if (slidesUpload.fromFile && slidesUpload.fileList?.length)
			form.append('slidesFile', slidesUpload.fileList[0]);
		else form.append('slidesURL', slidesUpload.url);

		waiting = true;

		const response: Response = await fetch('?/addSlides', {
			method: 'POST',
			body: form
		});

		if (!response.ok) {
			waiting = false;
			console.log(response.statusText);
			return { success: false, msg: response.statusText };
		}

		const json = await response.json();
		const responseData: {
			success: boolean;
			error: string | undefined;
			lecture: {
				video: string;
				slides: string;
				userId: string;
				info: { title: string; date: string };
			};
		} = formResponseToJSON(json.data.toString());

		waiting = false;

		if (responseData.success) {
			lecture = JSON.parse(responseData.lecture.toString());
			return { success: true, msg: undefined };
		} else return { success: false, msg: responseData.error };
	}

	async function handleSubmit(): Promise<{ success: boolean; msg: string | undefined }> {
		const form: FormData = new FormData();

		form.append('lecture', JSON.stringify(lecture));

		waiting = true;

		const response: Response = await fetch('?/submit', {
			method: 'POST',
			body: form
		});

		if (!response.ok) {
			waiting = false;
			console.log(response.statusText);
			return { success: false, msg: response.statusText };
		}

		const json = await response.json();
		// if (json.type == 'redirect') return { success: true, msg: "Already redirected."};

		const responseData: {
			success: boolean;
			projectId: number | undefined;
			error: string | undefined;
		} = formResponseToJSON(json.data.toString());

		waiting = false;

		if (responseData.success) {
			try {
				return { success: true, msg: undefined };
			} finally {
				console.log("Try to redirect.");
				goto(`/new/inprogress/${responseData.projectId}`);
			}
		} else return { success: false, msg: responseData.error };
	}
</script>

<svelte:window on:beforeunload={beforeUnload} />

<div class="flex flex-col w-full p-5 m-10 bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
	<ProgressIndicator bind:currentStep bind:steps bind:waiting />

	<!-- If waiting for something, show a spinner, else show form -->
	{#if waiting}
		<div class="text-center p-10">
			<Spinner size="16" />
		</div>
	{:else}
		<!-- Upload Lecture -->
		<FormStep
			bind:step={steps[0]}
			bind:currentStep
			isPopulated={() => (lectureUpload.fromFile ? !!lectureUpload.fileList : !!lectureUpload.url)}
			submit={() => handleLecture()}
		>
			<h1 class="text-2xl font-bold dark:text-white">Upload lecture:</h1>
			<FileUpload bind:upload={lectureUpload} name="Lecture" allowedFileType=".mp4" required />
		</FormStep>

		<!-- Upload Slides (maybe) -->
		<FormStep
			step={steps[1]}
			bind:currentStep
			isPopulated={() => (slidesUpload.fromFile ? !!slidesUpload.fileList : !!slidesUpload.url)}
			submit={() => handleSlides()}
		>
			<h1 class="text-2xl font-bold dark:text-white">Upload slides:</h1>
			<FileUpload bind:upload={slidesUpload} name="Slides" allowedFileType=".pdf" />
		</FormStep>

		<!-- Confirm title and date (guessed from lecture/slides) -->
		<FormStep
			step={steps[2]}
			bind:currentStep
			isPopulated={() => !!lecture.info.date && !!lecture.info.title}
		>
			<h1 class="text-2xl font-bold dark:text-white">Project Information:</h1>
			<div class="flex flex-col space-y-3">
				<h1 class="font-semibold dark:text-white">Please verify the following:</h1>
				<div class="flex flex-row space-x-5 px-5">
					<div class="w-full p-3 mx-5">
						<span class="dark:text-white p-1">Title:</span>
						<Input type="text" bind:value={lecture.info.title} placeholder="My Lecture..." />
					</div>
					<div class="w-full p-3 mx-5">
						<span class="dark:text-white p-1">Date:</span>
						<Input type="date" bind:value={lecture.info.date} />
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
			submit={() => handleSubmit()}
		>
			<h1 class="text-2xl font-bold dark:text-white">Review & Submit:</h1>
			<div class="flex flex-row justify-between w-full space-x-5">
				<div class="flex flex-col w-full shadow-md shadow-black outline-1 outline-black p-5 m-5 rounded-xl space-y-5">
					<div class="flex flex-row w-full justify-between mb-5">
						<h1 class="font-bold text-xl text-clip">{lecture.info.title}</h1>
						<h1 class="text-lg text-clip">{lecture.info.date}</h1>
					</div>
					<h1 class="text-lg text-clip">Video: {lecture.video}</h1>
					<h1 class="text-lg text-clip">Slides: {lecture.slides ?? "None"}</h1>
				</div>
				<div class="flex flex-col w-full m-5 space-y-5">
					<div class="flex flex-col shadow-md shadow-black outline-1 outline-black p-5 rounded-xl">
						<Label class="pb-4 text-lg">How detailed should the summary be:</Label>
						<Range id="range-steps" min="1" max="3" bind:value={lecture.customisation.summaryLevel} step="1" />
						<div class="pt-4 flex w-full justify-between">
							<h1 class={lecture.customisation.summaryLevel === 1 ? "font-semibold" : ""}>Concise</h1>
							<h1 class={lecture.customisation.summaryLevel === 3 ? "font-semibold" : ""}>Detailed</h1>
						</div>
					</div>
					<div class="flex flex-row space-x-5 align-middle shadow-md shadow-black outline-1 outline-black p-5 rounded-xl">
						<Label class="text-lg align-middle">Generate Questions:</Label>
						<Toggle bind:checked={lecture.customisation.questions}/>
					</div>
				</div>
			</div>
			{#if !data.session?.user}
				<h1 class="font-medium text-orange-600">
					Warning: you are not logged in. This project will only be accessible via URL.
				</h1>
			{/if}
		</FormStep>
	{/if}
</div>
