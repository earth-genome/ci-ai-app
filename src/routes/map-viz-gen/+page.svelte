<script>
	import { onMount } from 'svelte';
	import Map from '$lib/components/Map.svelte';

	let inputText = '';
	let isSubmitted = false;
	let mapData = null;
	let assistantResponse = '';
	let isLoading = false;

	function toggleSubmitted() {
		console.log("Toggle function called");
		isSubmitted = !isSubmitted;
		console.log("isSubmitted is now:", isSubmitted);
	}

	onMount(() => {
		console.log("Component mounted");
	});
</script>

<div>
	<p>Current state: {isSubmitted ? 'Submitted' : 'Not Submitted'}</p>
	<p>Loading: {isLoading ? 'Yes' : 'No'}</p>
</div>

{#if !isSubmitted}
	<div class="flex items-center justify-center min-h-screen">
		<div class="container mx-auto p-4">
			<h1 class="text-custom-intro mb-4 text-center">
				We have geospatial data on the relationship between health, climate, and deforestation in
				the Amazon. Ask a question related to these topics and a map visualization will be generated
				below
			</h1>
			<textarea
				bind:value={inputText}
				class="textarea textarea-bordered w-full h-14 mb-4"
				placeholder="Enter your text here..."
			/>
			<button on:click={sendMessage} class="btn btn-outline" disabled={isLoading}>
				{#if isLoading}
					Loading...
				{:else}
					Submit
				{/if}
			</button>
			<button on:click={toggleSubmitted} class="btn btn-outline ml-2">
				Toggle State
			</button>
		</div>
	</div>
{:else}
	<div class="flex">
		<div class="w-2/3 p-4">
			<Map />
			<p>hello</p>
		</div>
		<div class="w-1/3 p-4">
			<h2 class="text-2xl mb-4">Map Visualization Explanation</h2>
			<p>{assistantResponse}</p>
		</div>
	</div>
{/if}

<style>
	.text-custom-intro {
		font-size: 1.7rem;
		font-weight: 700;
	}
</style>