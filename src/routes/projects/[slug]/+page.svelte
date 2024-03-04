<script lang="ts">
	import InformationBox from './InformationBox.svelte';
	import { goto } from '$app/navigation';
	import {
		EditSolid,
		DownloadSolid,
		ChevronLeftOutline,
		ChevronRightOutline
	} from 'flowbite-svelte-icons';
	import { ButtonGroup, Button, Pagination, Video } from 'flowbite-svelte';
	import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/Prisma';
	import DownloadModal from '../../DownloadModal.svelte';
	import type { Customisation } from '$lib/types/Customisation';

	const accumulateSlideData = (slideData: PrismaSlidesData[]): PrismaBasicData => {
		let basicData: PrismaBasicData;

		let transcripts: string[] = [];
		let summaries: string[] = [];
		slideData.forEach((element) => {
			transcripts.push(element.transcript);
			summaries.push(element.summary);
		});

		basicData = { transcript: transcripts.join(' '), summary: summaries.join(' ') };
		return basicData;
	};

	export let data;

	let displaySlides = data.project.hasSlides;
	let slideData: PrismaSlidesData[];
	let overviewData: PrismaBasicData;
	let slideNo: number;
	let pages: { name: string; href: string }[];

	let showDownloadModal: boolean = false;
	let customisation: Customisation = data.project.customisation
		? JSON.parse(JSON.stringify(data.project.customisation))
		: {
				highlight_keywords: false,
				questions: false,
				summary_format: '',
				length: 1
			};

	$: displayButtonText = displaySlides ? 'Slides View' : 'Overview';

	console.log(data.project);

	if (displaySlides) {
		slideData = JSON.parse(JSON.stringify(data.project.data));
		overviewData = accumulateSlideData(slideData);
		slideNo = data.pageNo - 1;

		pages = slideData.map((slide, index) => {
			return {
				name: (index + 1).toString(),
				href: `/projects/${data.project.id}?page=${index + 1}`,
				active: index + 1 === data.pageNo
			};
		});
	} else {
		overviewData = JSON.parse(JSON.stringify(data.project.data));
	}

	const changeView = () => {
		displaySlides = !displaySlides;
	};

	const previous = () => {
		const params = new URLSearchParams(window.location.search);
		const pageNo = parseInt(params.get('page') ?? '1');
		const page = Math.max(pageNo - 1, 1);
		params.set('page', page.toString());
		window.location.search = params.toString();
	};

	const next = () => {
		const params = new URLSearchParams(window.location.search);
		const pageNo = parseInt(params.get('page') ?? '1');
		const page = Math.min(pageNo + 1, slideData.length);
		params.set('page', page.toString());
		window.location.search = params.toString();
	};

	const pageClicked = (e: MouseEvent) => {
		const params = new URLSearchParams(window.location.search);
		const page = parseInt((e.target as HTMLButtonElement).textContent ?? '1');
		params.set('page', page.toString());
		window.location.search = params.toString();
	};

	function edit() {
		goto(`/edit/${data.project.id}`);
	}
</script>

<!--  the filename will be stored in the S3 storage with the format title_id -->
<DownloadModal bind:open={showDownloadModal} project={data.project} />

<div class="flex-1">
	<div class="flex-col px-10 pt-10">
		<div class="flow-root">
			<div class="float-left justify-start items-center flex">
				<h1 class="text-4xl p-5 font-bold dark:text-white">{data.project.title}</h1>
				<ButtonGroup class="space-x-px">
					<Button pill color="dark" on:click={edit}>
						<EditSolid class="focus:!outline-none" />
						Edit
					</Button>
					<Button pill color="dark" on:click={() => (showDownloadModal = true)}>
						<DownloadSolid class="me-2 focus:!outline-none" />
						Download
					</Button>
				</ButtonGroup>
			</div>
			{#if data.project.hasSlides}
				<div class="float-right justify-end items-center flex">
					<Button pill color="dark" on:click={changeView}>{displayButtonText}</Button>
				</div>
			{/if}
		</div>
		{#if displaySlides}
			<div class="flex flex-col">
				<div class="flex">
					<div class="flex justify-center">
						<Video
							src={data.project.video}
							controls
							class="m-5 rounded-xl h-72 outline-1 outline-transparent shadow-md shadow-black"
						/>
					</div>
					<InformationBox title="Transcript:" maxHeight="72" additionalAttributes="flex-1">
						<p>{slideData[slideNo].transcript}</p>
					</InformationBox>
				</div>
				<div class="flex">
					<div class="flex justify-center">
						<img
							class="m-5 h-72 rounded-xl outline-1 outline-transparent shadow-md shadow-black"
							src={slideData[slideNo].slide}
							alt="Slide 1"
						/>
					</div>
					<InformationBox title="Summary:" maxHeight="72" additionalAttributes="flex-1">
						<p>{slideData[slideNo].summary}</p>
					</InformationBox>
				</div>
			</div>
			<div class="flex justify-center">
				<Pagination {pages} large on:previous={previous} on:next={next} on:click={pageClicked} icon>
					<svelte:fragment slot="prev">
						<span class="sr-only">Previous</span>
						<ChevronLeftOutline class="w-7 h-7" />
					</svelte:fragment>
					<svelte:fragment slot="next">
						<span class="sr-only">Next</span>
						<ChevronRightOutline class="w-7 h-7" />
					</svelte:fragment>
				</Pagination>
			</div>
		{:else}
			<div class="flex">
				<div class="flex-col flex-1 p-5">
					<div class="flex justify-center">
						<Video
							src={data.project.video}
							controls
							class="rounded-xl h-72 outline-1 outline-transparent shadow-md shadow-black"
						/>
					</div>
					<InformationBox title="Transcript:" maxHeight="72" additionalAttributes="min-h-72">
						<p>{overviewData.transcript}</p>
					</InformationBox>
				</div>
				<InformationBox
					title="Summary:"
					maxHeight="[650px]"
					additionalAttributes="flex-1 min-h-[600px]"
				>
					<p>{overviewData.summary}</p>
				</InformationBox>
			</div>
		{/if}
	</div>
</div>
