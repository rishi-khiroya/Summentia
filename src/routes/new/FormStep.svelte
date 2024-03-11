<script lang="ts">
	import { Button, Badge, Indicator } from 'flowbite-svelte';
	import { StepStatus, type Step } from './(types)/Step';

	export let currentStep: number;
	export let step: Step;
	export let backStatus: boolean;

	export let submit: () =>
		| { success: boolean; msg: string | undefined }
		| Promise<{ success: boolean; msg: string | undefined }> = () => {
		return { success: true, msg: undefined };
	};
	export let isPopulated: () => boolean = () => true;

	$: try {
		step.populated = isPopulated();
	} catch (e) {
		// console.warn(e);
		step.populated = false;
	}
</script>

{#if currentStep == step.id}
	<div class="flex-1 flex-col items-center">
		<slot />
		<p class="italic text-gray-600 dark:text-gray-400 pt-5">* Required</p>
		<div class="flex flex-row justify-between space-x-3 pt-2">
			<Button color="alternative" disabled={currentStep == 0 || !backStatus} on:click={() => currentStep--}
				>Previous</Button
			>
			<div class="flex flex-row p-1 m-1">
				{#if backStatus}
					<Badge color="green" rounded class="px-2.5 py-0.5">
						<Indicator color="green" size="xs" class="me-1" />Available
					</Badge>
				{:else}
					<Badge color="red" rounded class="px-2.5 py-0.5">
						<Indicator color="red" size="xs" class="me-1" />Busy
					</Badge>
				{/if}
			</div>
			<Button
				color="alternative"
				disabled={!backStatus}
				on:click={async () => {
					if (step.required && !step.populated) return;

					if (step.populated) {
						const response = await submit();
						if (!response.success) return; // TODO: indicate to user why it failed using msg
					}
					if (currentStep == -1) return;

					// Set status and move to next step
					step.status = step.populated ? StepStatus.COMPLETED : StepStatus.SKIPPED;
					currentStep++;
				}}>{step.id == -1 ? 'Submit' : step.required || step.populated ? 'Next' : 'Skip'}</Button
			>
		</div>
	</div>
{/if}
