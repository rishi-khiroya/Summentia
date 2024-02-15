<script lang="ts">
	import { StepStatus, type Step } from './(types)/Step';
	import { Indicator } from 'flowbite-svelte';

	export let currentStep: number;
	export let steps: Step[];
	export let waiting: boolean;

	const ACTIVE_TEXT_STYLE: string = 'font-bold text-black dark:text-white';
	const PASSIVE_TEXT_STYLE: string = 'text-gray-700 dark:text-gray-300';

	const ACTIVE_SEPARATOR_STYLE: string =
		'h-1 rounded-2xl animate-pulse bg-gray-300 dark:bg-gray-600';
	const PASSIVE_SEPARATOR_STYLE: string = 'h-0.5 bg-gray-200  dark:bg-gray-700';

	function statusToColor(step: Step): 'gray' | 'red' | 'yellow' | 'green' {
		switch (step.status) {
			case StepStatus.COMPLETED:
				return 'green';
			case StepStatus.SKIPPED:
				return step.required ? 'red' : 'yellow';
			case StepStatus.UNSEEN:
				return 'gray';
		}
	}

	function gotoStep(target: number) {
		// Update step statuses accordingly
		if (target == currentStep) return;
		else if (currentStep == -1) {
			for (let i = steps.length - 1; i >= target; i--)
				if (steps[i].status != StepStatus.COMPLETED) steps[i].status = StepStatus.UNSEEN;
		} else if (target == -1) {
			for (let i = currentStep; i < steps.length; i++)
				if (steps[i].status != StepStatus.COMPLETED) steps[i].status = StepStatus.SKIPPED;
		} else if (target > currentStep) {
			for (let i = currentStep; i < target; i++)
				if (steps[i].status != StepStatus.COMPLETED) steps[i].status = StepStatus.SKIPPED;
		} else {
			for (let i = currentStep; i >= target; i--)
				if (steps[i].status != StepStatus.COMPLETED) steps[i].status = StepStatus.UNSEEN;
		}

		// Move to step
		currentStep = target;
	}
</script>

<div class="flex flex-row">
	<div class="flex w-full items-center justify-between">
		{#each steps as step}
			<!-- Final Step requires different styling to be completely on the right -->
			<div class="flex flex-row w-full mb-6">
				<button
					class="flex flex-col items-center hover:cursor-pointer"
					on:click={() => gotoStep(step.id)}
				>
					<Indicator
						size="xl"
						color={statusToColor(step)}
						class={currentStep == step.id ? 'border-2 border-black dark:border-orange-400' : ''}
					/>
					<div class="mt-3">
						<h3 class={currentStep == step.id ? ACTIVE_TEXT_STYLE : PASSIVE_TEXT_STYLE}>
							{step.name + (step.required ? '*' : '')}
						</h3>
					</div>
				</button>
				<div
					class={`flex w-full mt-3 ${waiting && step.id == currentStep ? ACTIVE_SEPARATOR_STYLE : PASSIVE_SEPARATOR_STYLE}`}
				/>
			</div>
		{/each}
		<button
			class="flex flex-col items-center mb-6 hover:cursor-pointer"
			on:click={() => gotoStep(-1)}
		>
			<div class="flex items-center">
				<Indicator
					size="xl"
					color="gray"
					class={currentStep == -1 ? 'border-2 border-black dark:border-orange-400' : ''}
				/>
			</div>
			<div class="mt-3">
				<h3 class={`${currentStep == -1 ? ACTIVE_TEXT_STYLE : PASSIVE_TEXT_STYLE}`}>Submit</h3>
			</div>
		</button>
	</div>
</div>
