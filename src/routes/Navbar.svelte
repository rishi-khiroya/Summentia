<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Dropdown, DropdownDivider, DropdownItem, Avatar, DropdownHeader } from 'flowbite-svelte';
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
				<div class="flex items-center md:order-2">
					<Avatar id="avatar-menu" src={$page.data.session.user.image} class="hover:cursor-pointer"/>
					<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
				</div>
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownHeader>
						<span class="block truncate text-sm font-medium">{$page.data.session.user.email}</span>
					</DropdownHeader>
					<DropdownItem href="dashboard">Dashboard</DropdownItem>
					<DropdownItem href="projects">Projects</DropdownItem>
					<DropdownItem>Settings</DropdownItem>
					<DropdownDivider />
					<DropdownItem on:click={() => signOut()}>Sign out</DropdownItem>
				</Dropdown>
			{:else}
				<Button
					outline
					color="light"
					on:click={() => signIn("auth0")}
					class="text-primary-500 dark:text-primary-600 border dark:border-gray-800 dark:hidden"
					>Sign in</Button
				>
				<Button
					outline
					color="dark"
					on:click={() => signIn("auth0")}
					class="text-primary-500 dark:text-primary-600 border dark:border-gray-800 dark:block hidden"
					>Sign in</Button
				>
			{/if}
		</div>
	</Navbar>
</div>
