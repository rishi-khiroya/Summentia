<script>
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
</script>

<div class="shadow-slate-200 dark:shadow-gray-950 shadow-sm-light">
	<Navbar >
		<NavBrand href="/">
			<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white px-5"
				>Summentia</span
			>
		</NavBrand>
		<DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800" />
	</Navbar>
</div>
