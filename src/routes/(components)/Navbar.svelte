<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	$: activeUrl = $page.url.pathname;
</script>

<div class="shadow-slate-200 dark:shadow-gray-950 shadow-sm-light">
	<Navbar>
		<NavBrand href="/">
			<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white px-5"
				>Summentia</span
			>
		</NavBrand>
		<!-- <NavUl {activeUrl}>
			<NavLi href="/">Add New Project</NavLi>
			<NavLi href="/projects">Past Project</NavLi>
		</NavUl> -->
		<div class="flex space-x-5">
			<DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800" />
			{#if $page.data.session}
				<Button
					outline
					color="light"
					on:click={() => signOut()}
					class="text-primary-500 dark:text-primary-600 border dark:border-gray-800 dark:hidden"
					>Logout</Button
				>
				<Button
					outline
					color="dark"
					on:click={() => signOut()}
					class="text-primary-500 dark:text-primary-600 border dark:border-gray-800 hidden dark:block"
					>Logout</Button
				>
			{:else}
				<Button
					outline
					color="light"
					on:click={() => signIn("auth0")}
					class="text-primary-500 dark:text-primary-600 border dark:border-gray-800 dark:hidden"
					>Login</Button
				>
				<Button
					outline
					color="dark"
					on:click={() => signIn("auth0")}
					class="text-primary-500 dark:text-primary-600 border dark:border-gray-800 dark:block hidden"
					>Login</Button
				>
			{/if}
		</div>
	</Navbar>
</div>
