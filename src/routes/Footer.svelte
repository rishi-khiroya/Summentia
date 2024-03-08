<script lang="ts">
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink, Modal } from 'flowbite-svelte';
</script>

<div class="flex justify-center p-3">
	<Footer class="flex flex-wrap space-x-5">
		<FooterCopyright
			href="/"
			by="Summentia"
			year={2024}
			classSpan="text-gray-800 dark:text-gray-400"
		/>
		<!-- <FooterLinkGroup
			ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-800 dark:text-gray-400 sm:mt-0"
		>
			<FooterLink on:click={() => (aboutModal = true)}>About</FooterLink>
			<FooterLink href="/">Privacy Policy</FooterLink>
			<FooterLink href="/">Licensing</FooterLink>
			<FooterLink href="/">Contact</FooterLink>
		</FooterLinkGroup> -->
	</Footer>
</div>
