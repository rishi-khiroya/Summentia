<script lang="ts">
	import InformationBox from './InformationBox.svelte';
	import { goto } from '$app/navigation';
	import {
		EditSolid,
		DownloadSolid,
		AngleDownSolid,
		ChevronLeftOutline,
		ChevronRightOutline
	} from 'flowbite-svelte-icons';
	import {
		ButtonGroup,
		Button,
		Dropdown,
		DropdownItem,
		ImagePlaceholder,
		VideoPlaceholder,
		TextPlaceholder,
		CardPlaceholder,
		Pagination,
		Video
	} from 'flowbite-svelte';
	import type { PrismaBasicData, PrismaSlidesData } from '$lib/types/Prisma';

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

	const downloadOptionPressed = async (e: MouseEvent) => {
		let option = e.target?.textContent ?? 'unknown';

		const form = new FormData();
		form.append('type', option.substring(1));

		const response = await fetch(`?/download`, {
			method:'POST',
			body: form
		})

		const blob = await response.blob();
		const url = window.URL || window.webkitURL;
		const link = url.createObjectURL(blob);
		let a = document.createElement("a");
		a.setAttribute("download", `summary.${option.substring(1)}`);
		a.setAttribute("href", link);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		// alert(`Download option ${option} pressed`);
	};

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

<div class="flex-1">
	<div class="flex-col px-10 pt-10">
		<div class="flow-root">
			<div class="float-left justify-start items-center flex">
				<Button class="h-10 w-10" pill color="dark" on:click={edit}
					><EditSolid class="focus:!outline-none" /></Button
				>
				<h1 class="text-4xl p-5 font-bold dark:text-white">{data.project.title}</h1>
				<ButtonGroup>
					<Button pill color="dark"
						><DownloadSolid class="me-2 focus:!outline-none" />Download Summary</Button
					>

					<Button class="border-l border-gray-500 w-5" color="dark">
						<AngleDownSolid class="focus:!outline-none"></AngleDownSolid>
					</Button>
					<Dropdown>
						<div slot="header">
							<span class="font-medium py-2 px-4 text-md">Summary File Type</span>
						</div>
						<DropdownItem on:click={downloadOptionPressed}>.pdf</DropdownItem>
						<DropdownItem on:click={downloadOptionPressed}>.tex</DropdownItem>
						<DropdownItem on:click={downloadOptionPressed}>.doc</DropdownItem>
						<DropdownItem on:click={downloadOptionPressed}>.txt</DropdownItem>
					</Dropdown>
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
							alt="Slide 1">
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
