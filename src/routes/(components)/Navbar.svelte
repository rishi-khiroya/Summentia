<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
</script>

<div class="shadow-slate-200 dark:shadow-gray-950 shadow-sm-light">
	<Navbar >
		<NavBrand href="/">
			<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white px-5"
				>Summentia</span
			>
		</NavBrand>
		<NavUl {activeUrl}>
			<NavLi href="/">Add New Project</NavLi>
    		<NavLi href="/projects">Past Project</NavLi>
    		<NavLi href="/">Logout</NavLi>
		</NavUl>
		<DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800" />
	</Navbar>
</div>
