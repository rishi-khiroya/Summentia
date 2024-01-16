<script>
	import '../app.css';
	import Footer from './(components)/Footer.svelte';
	import Navbar from './(components)/Navbar.svelte';
</script>

<div
	class="flex flex-col bg-gradient-to-br
        from-white via-slate-200 to-slate-600
        dark:from-black dark:via-slate-800 dark:to-slate-700
        bg-animate min-h-screen h-max justify-between"
>
	<Navbar />
	<slot />
	<Footer />
</div>

<style>
	.bg-animate {
		background-size: 400%;

		-webkit-animation: AnimationName 10s ease infinite;
		-moz-animation: AnimationName 10s ease infinite;
		animation: AnimationName 10s ease infinite;
	}
</style>
