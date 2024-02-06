<script lang="ts">
	import { Fileupload } from 'flowbite-svelte';

	export let slidesFile: File;
</script>

<div class="flex py-3">
	<Fileupload bind:slidesFile />
</div>
