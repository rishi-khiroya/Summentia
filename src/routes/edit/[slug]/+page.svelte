<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/prisma';
	import { Button, Modal, Textarea, Checkbox } from 'flowbite-svelte';
	import { ExclamationCircleOutline, FileCheckSolid, PlusSolid } from 'flowbite-svelte-icons';

	export let data;
	
	const groupSlides = (slidesData: PrismaSlidesData[]) => {
		let index = 0;
		slideGroups = slidesData.reduce(
			(curr: {squashed: boolean, values: [number, PrismaSlidesData][]}[], val: PrismaSlidesData) => {
				let group = curr.length ? curr[curr.length - 1] : undefined;
				numSlides += val.squashed ? 0 : 1;
				const currSlideNo = val.squashed ? index : numSlides;
				if (group && group.squashed === val.squashed) {
					group.values.push([currSlideNo, val]);
				} else {
					curr.push({ squashed: val.squashed, values: [[currSlideNo, val]] });
				}
				
				if (val.squashed) {
					hiddenSlidesToAddBack.set(index, false);
				}
				index++;
				return curr;
			}, 
			[]
			);
		}
		
	let backModal: boolean = false;
	let addHiddenSlidesModal: boolean = false;
	let squashedSlides: [number, PrismaSlidesData][];
	let hiddenSlidesToAddBack: Map<number, boolean> = new Map();
	
	let slidesData = data.data;
	let saved: boolean = true;
	let dirty: boolean = false;
	let slideGroups: {squashed: boolean, values: [number, PrismaSlidesData][]}[];
	let numSlides = 0;

	if (data.hasSlides) {
		groupSlides(slidesData);
	}

	const addHiddenSlides = () => {
		hiddenSlidesToAddBack.forEach((value, index) => {
			if (value) {
				slidesData[index].squashed = false;
			}
		})
		hiddenSlidesToAddBack.clear();
		numSlides = 0;
		saved = false;
		groupSlides(slidesData);
	}

	async function save() {
		const form: FormData = new FormData();

		// Add userId to the form
		if (data.session) form.append('userId', data.session.user.id);

		form.append('hasSlides', data.hasSlides.toString())
		if (data.hasSlides) {
			slidesData.forEach((data: PrismaSlidesData) => {
				form.append('data', JSON.stringify(data));
			});
		}
		else {
			form.append('data', JSON.stringify(slidesData));
		}

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
		<Button color="red" class="me-2" href={`../projects/${data.id}`}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>

<Modal bind:open={addHiddenSlidesModal} autoclose size="lg">
	<div class="text-center">
		<h1 class="mb-5 text-xl font-bold dark:text-white">Select which slides you want to add back.</h1>
		<div class="flex flex-col justify-center items-center">
			{#key squashedSlides}
				{#each squashedSlides as [ slideIndex, slideData ], index}
					<Checkbox custom on:change={() => {
						const value = hiddenSlidesToAddBack.get(slideIndex);
						hiddenSlidesToAddBack.set(slideIndex, value !== undefined ? !value : true);
					}}>
						<img 
							class="m-5 h-72 rounded-xl outline outline-4 outline-transparent shadow-md shadow-black cursor-pointer peer-checked:outline-blue-500"
							src={slideData.slide}
							alt="Squashed Slide {index + 1}"
						>
					</Checkbox>
				{/each}
			{/key}
		</div>
		<Button color="green" on:click={addHiddenSlides}>Add hidden slides</Button>
	</div>
</Modal>

<div class="flex flex-col w-full p-20">
	<h1 class="text-5xl p-10 font-bold dark:text-white">Summary Editor</h1>

	{#if data.hasSlides}
		{#each slideGroups as { squashed, values }}
			{#if squashed}
				<div class="flex">
					<Button pill class="!p-2" color="dark" on:click={() => {
						squashedSlides = values;
						addHiddenSlidesModal = true;
					}}><PlusSolid class="w-4 h-4" /></Button>
					<div class="w-full">
						<p class="text-center overflow-hidden before:ml-0 before:h-0.5 after:h-0.5 after:bg-black 
						after:inline-block after:relative after:align-middle after:w-2/5
						before:bg-black before:inline-block before:relative before:align-middle 
						before:w-2/5 before:right-2 after:left-2 text-md">Add hidden slides
						</p>
					</div>
				</div>
			{:else}
				{#each values as [ slideNo, slideData ]}
					<div class="justify-between flex w-full space-x-6 m-4">
						<div
							class="flex flex-col w-full bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-1 px-10 pt-5 pb-10"
						>
							<h2 class="text-xl px-2 font-semibold text-center pb-5 dark:text-white">
								Slide {slideNo}/{numSlides}
							</h2>
		
							<!-- svelte-ignore a11y-img-redundant-alt -->
							<img class="flex-1" src={slideData.slide} alt="Slide {slideNo}" />
						</div>
		
						<div
							class="flex flex-col w-full bg-white dark:bg-slate-800 outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-1 px-10 pt-5 pb-10"
						>
							<h2 class="text-xl px-2 font-semibold text-center pb-5 dark:text-white">
								Summary {slideNo}/{numSlides}
							</h2>
							<Textarea rows="13" cols="100" bind:value={slideData.summaries} on:change={() => (saved = false)} />
						</div>
					</div>
				{/each}
			{/if}
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
