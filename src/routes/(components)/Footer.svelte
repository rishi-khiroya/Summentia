<script>
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<div class="flex justify-center p-3">
	<Footer>
		<FooterLinkGroup
			ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-800 dark:text-gray-400 sm:mt-0 space-x-5"
		>
			<FooterCopyright href="/" by="Summentia" year={2024} classSpan="text-gray-800 dark:text-gray-400"/>
			<div class="flex flex-wrap">
				<FooterLink href="/">About</FooterLink>
				<FooterLink href="/">Privacy Policy</FooterLink>
				<FooterLink href="/">Licensing</FooterLink>
				<FooterLink href="/">Contact</FooterLink>
			</div>
		</FooterLinkGroup>
	</Footer>
</div>
