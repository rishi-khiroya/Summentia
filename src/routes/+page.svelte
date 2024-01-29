<script lang="ts">
	import { enhance } from '$app/forms';

	let a = 0;
	let b = 0;
	let total = 0;
	async function pyAddPost() {
		const response = await fetch('/py', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json'
			}
		});
		let res = await response.json();
		total = res.sum;
	}

	async function pyAddGet() {
		const response = await fetch(`/py?a=${a}&b=${b}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		let res = await response.json();
		total = res.sum;
	}

	let loading: boolean = false;
	let error: string | undefined;
	let result: string | undefined;

	// handle the API SliTraNet endpoint
	function handleEndpoint() {
		loading = true;
		error = undefined;
		result = undefined;

		return ({ response }: any) => {
			loading = false;
			error = response.error;
			result = response.result;
		};
	}
</script>

<div class="sticky flex flex-row justify-center top-0 p-5">
	<h1 class="text-5xl text-center font-sans rounded-lg p-8 px-28 bg-slate-200">Summentia</h1>
</div>
<div>
	<h3>POST Example</h3>
	<form>
		<input type="number" name="a" placeholder="Number 1" bind:value={a} />
		<input type="number" name="b" placeholder="Number 2" bind:value={b} />
		<button on:click|preventDefault={pyAddPost}>Add</button>
	</form>
	<h4>Total: {total}</h4>

	<h3>GET Example</h3>
	<form>
		<input type="number" name="a" placeholder="Number 1" bind:value={a} />
		<input type="number" name="b" placeholder="Number 2" bind:value={b} />
		<button on:click|preventDefault={pyAddGet}>Add</button>
	</form>
	<h4>Total: {total}</h4>

	<h3>API CALL</h3>
	<form
		method="GET"
		action="api/SliTraNet"
		use:enhance={handleEndpoint}
		on:change={() => ((error = undefined), (result = undefined))}
	>
		<h4>HELLO!</h4>
	</form>
</div>
