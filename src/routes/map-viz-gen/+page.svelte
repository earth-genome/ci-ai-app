<script>
	import { onMount } from 'svelte';
	import Map from '$lib/components/Map.svelte';
	import MapVizSelect from '$lib/components/MapVizSelect.svelte';

	let inputText = '';
	let isSubmitted = true;
	let isLoading = false;
	let mapData = null;
	let assistantResponse = '';

	async function makeAssistantRequest() {
		try {
			isLoading = true;
			const res = await fetch('../api/map-viz-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message: inputText })
			});

			if (res.ok) {
				const data = await res.json();
				assistantResponse = data.answer;
				mapData = data.mapStyle; // You can handle the map visualization data
				console.log('Assistant response:', data);
			} else {
				console.error('Error:', res.statusText);
			}
		} catch (error) {
			console.error('Request error:', error);
		} finally {
			isLoading = false;
			isSubmitted = true;
		}
	}

	onMount(() => {
		console.log('Component mounted');
	});
</script>

{#if !isSubmitted}
	<!-- load the MapVizSelect Component -->
	<MapVizSelect />
	<!-- <div class="flex items-center justify-center min-h-screen">
		<div class="container mx-auto p-4">
			<h1 class="text-custom-intro mb-4 text-center">
				We have geospatial data on the relationship between health, climate, and deforestation in
				the Amazon. Ask a question related to these topics and a map visualization will be generated
				below
			</h1>
			<input
				bind:value={inputText}
				type="text"
				placeholder="Where does deforestation impact health in the Amazon.."
				class="input input-bordered w-full mb-4"
			/>
			<div class="flex justify-center">
				<button
					on:click={makeAssistantRequest}
					class="btn btn-outline btn-wide"
					disabled={isLoading}
				>
					{#if isLoading}
						Loading...
					{:else}
						Explore
					{/if}
				</button>
			</div>
		</div>
	</div> -->
{:else if isSubmitted && !isLoading}
	<div class="flex flex-1 overflow-hidden">
		<div class="w-2/3 shadow-xl rounded-lg overflow-hidden mx-1">
			<Map class="w-full h-full" />
		</div>
		<div class=" w-1/3 shadow-xl rounded-lg overflow-scroll p-2 map-viz-card mx-1">
			<h2 class="text-2xl mb-4 text-center title-font">Map Visualization Explanation</h2>
			<p>{assistantResponse}</p>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<div class="container mx-auto p-4">
			<h1 class="text-custom-intro mb-4 text-center">Generating map visualization...</h1>
		</div>
	</div>
{/if}

<style>
	.text-custom-intro {
		font-size: 1.7rem;
		font-weight: 700;
	}
	.map-viz-card {
		color: rgb(44, 38, 32);
		background-color: #f4f0e4;
	}
	.title-font {
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
	}
</style>
