<script lang="ts"></script>
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
    import { DarkMode } from 'flowbite-svelte';
    import { page } from '$app/stores';
</script>

<div class="shadow-slate-200 dark:shadow-gray-950 shadow-sm-light">
<Navbar let:hidden let:toggle>
    <div class="flex space-x-0 lg:space-x-10">
        <NavBrand href="/">
            <img src="vrish-logo.png" class="mr-3 h-8 sm:h-9" alt="Vrish Logo" />
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white hidden lg:block">
                Vrish || Rishi Khiroya
            </span>
        </NavBrand>
        <DarkMode />
    </div>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        {#each pages as { name, url }}
            <NavLi href={`${url}`} active={$page.url.pathname === url}>{name}</NavLi>
        {/each}
    </NavUl>
</Navbar>
</div>