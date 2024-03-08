<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';

	export let data;
	let flashcardIndex = 0;

	const flashCards: {
		front: string;
		back: string;
	}[] = data.flashCards;

	console.log(flashCards);

	$: clue = flashCards[flashcardIndex].front;
	$: answer = flashCards[flashcardIndex].back;

	let showCardBack = false;
	const toggleShowBack = () => (showCardBack = !showCardBack);

	const prevCard = () => {
		showCardBack = false;
		if (flashcardIndex === 0) {
			flashcardIndex = flashCards.length - 1;
		} else {
			flashcardIndex -= 1;
		}
	};

	const nextCard = () => {
		showCardBack = false;
		if (flashcardIndex === flashCards.length - 1) {
			flashcardIndex = 0;
		} else {
			flashcardIndex += 1;
		}
	};

	function back() {
		goto(`../projects/${data.project.id}`);
	}
</script>

<div class="flex flex-col w-full p-10">
	<h1 class="text-4xl p-10 font-bold dark:text-white">FlashCards</h1>
	<div class="flex p-20 pb-2 w-full justify-center items-center">
		<Button class="flex" color="dark" size="xl" on:click={prevCard}
			><ArrowLeftOutline class="w-10 h-10 ms-2" /></Button
		>
		<div class="flex p-10 justify-center">
			<div class="flip-box-inner" class:flip-it={showCardBack}>
				<button
					class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
					on:click={toggleShowBack}
				>
					{#if showCardBack}
						<div class="flip-box-back" class:conceal-answer={showCardBack}>
							<h3 class="mb-2 text-2xl font-bold tracking-tight text-blue-800 dark:text-white">
								{answer}
							</h3>
						</div>
					{:else}
						<div class="flip-box-front">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{clue}
							</h5>
						</div>
					{/if}
				</button>
			</div>
		</div>
		<Button class="flex" color="dark" size="xl" on:click={nextCard}
			><ArrowRightOutline class="w-10 h-10 ms-2" /></Button
		>
	</div>
	<p class="text-gray-800 dark:text-gray-300 animate-bounce text-center">
		Click the card to show the {showCardBack ? 'front' : 'back'}.
	</p>
	<div class="fixed bottom-0 left-0 p-5">
		<Button color="red" size="xl" on:click={() => back()}>Back</Button>
	</div>
</div>

<style>
	/* The flip box container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
	.flip-box {
		background-color: transparent;
		width: 600px;
		height: 500px;
		/* 		border: 1px solid #ddd; */
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
	}

	/* This container is needed to position the front and back side */
	.flip-box-inner {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		text-align: center;
		transition: transform 0.4s;
		transform-style: preserve-3d;
		background-color: transparent;
	}

	/* Do an horizontal flip on button click */
	.flip-it {
		transform: rotateY(180deg);
	}

	@keyframes revealTextSlowly {
		to {
			color: white;
		}
	}

	.conceal-answer {
		animation: revealTextSlowly 0.3s forwards;
	}

	/* Style the back side */
	.flip-box-back {
		transform: rotateY(180deg);
	}
</style>
