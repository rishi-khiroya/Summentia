<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Modal, Textarea } from 'flowbite-svelte';
	import { ExclamationCircleOutline, FileCheckSolid } from 'flowbite-svelte-icons';

	export let data;

	let slidesData = data.data;
	let saved: boolean = true;
	let backModal: boolean = false;
	let dirty: boolean = false;

	async function save() {
		const form: FormData = new FormData();

		// Add userId to the form
		if (data.session) form.append('userId', data.session.user.id);

		form.append('hasSlides', data.hasSlides.toString())
		if (data.hasSlides)
			slidesData.forEach((data) => {
				form.append('data', JSON.stringify(data));
			});
		else form.append('data', JSON.stringify(slidesData));

		form.append('id', data.id.toString());

		const response = await fetch('?/save', {
			method: 'POST',
			body: form
		});

		if (response.ok) saved = true;
		// TODO: trigger toast
	}

	function back() {
		if (saved) goto(`../projects/${data.id}`);
		else {
			dirty = true;
			backModal = true;
		}
	}

	// Stop the page from refreshing without confirmation of losing data.
	function beforeUnload(event: BeforeUnloadEvent): string {
		if (saved || dirty) return '';

		event.preventDefault();
		event.returnValue = '';
		return '';
	}
</script>

<svelte:window on:beforeunload={beforeUnload} />

<Modal bind:open={backModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg text-gray-500 dark:text-gray-400">
			Are you sure you want to go back? Your changes will not be saved.
		</h3>
		<Button color="red" class="me-2" href={`projects/${data.id}`}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>

<div class="flex flex-col w-full p-20">
	<h1 class="text-5xl p-10 font-bold dark:text-white">Summary Editor</h1>

	{#if data.hasSlides}
		{#each slidesData as { slide, summary }, index}
			<div class="justify-between flex w-full space-x-6 m-4">
				<div
					class="flex flex-col w-full bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-1 px-10 pt-5 pb-10"
				>
					<h2 class="text-xl px-2 font-semibold text-center pb-5 dark:text-white">
						Slide {index + 1}/{slidesData.length}
					</h2>

					<!-- svelte-ignore a11y-img-redundant-alt -->
					<img class="flex-1" src={slide} alt="Slide {index + 1}" />
				</div>

				<div
					class="flex flex-col w-full bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-1 px-10 pt-5 pb-10"
				>
					<h2 class="text-xl px-2 font-semibold text-center pb-5 dark:text-white">
						Summary {index + 1}/{slidesData.length}
					</h2>
					<Textarea rows="13" cols="100" bind:value={summary} on:change={() => (saved = false)} />
				</div>
			</div>
		{/each}
	{:else}
		<div
			class="flex flex-col w-full bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-1 px-10 pt-5 pb-10"
		>
			<h2 class="text-xl px-2 font-semibold text-center pb-5 dark:text-white">Summary</h2>
			<Textarea
				rows="13"
				cols="100"
				bind:value={data.data.summary}
				on:change={() => (saved = false)}
			/>
		</div>
	{/if}
</div>

<div class="fixed bottom-0 left-0 p-5">
	<Button color="red" size="xl" on:click={() => back()}>Back</Button>

	<Button color="green" size="xl" on:click={() => save()}>
		Save
		<FileCheckSolid />
	</Button>
</div>
