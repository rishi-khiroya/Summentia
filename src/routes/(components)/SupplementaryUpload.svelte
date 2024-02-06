<script lang="ts">
	import { Fileupload, Listgroup, ListgroupItem } from 'flowbite-svelte';

	export let supplementaryFiles: File[];
</script>

<div class="flex py-3">
	<Fileupload multiple bind:supplementaryFiles />
</div>
