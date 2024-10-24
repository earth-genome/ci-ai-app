<script>
	import { onMount } from 'svelte';
	import Map from '$lib/components/Map.svelte';
	import { selectedProperty } from '$lib/stores.js';

	let inputText = '';
	let isLoading = false;
	let mapData = null;
	let assistantResponse = null;
    let recommendationData = '';
	let dataProperties;
	let currentProperty = null;

	const vizProperties = [
		'Delta_T',
		'local_0-2km_delta',
		'regional_2-5km_delta',
		'regional_5-10km_delta',
		'regional_10-25km_delta',
		'regional_25-50km_delta',
		'regional_50-100km_delta',
		'regional_2-10km_delta',
		'regional_10-100km_delta',
        "wbgt_rcp8_se6flor", 
		"wbgt_hist_se6flor",
		"wbgt_rcp4_comflor-hist_comflor",
		"wbgt_rcp4_se6flor-hist_comflor",
		"wbgt_rcp8_comflor",
		"wbgt_rcp8_se6flor-hist_comflor",
		"wbgt_hist_comflor-ERA5",
		"wbgt_rcp8_comflor-hist_comflor",
		"wbgt_hist_se6flor-hist_comflor",
		"wbgt_rcp8_se6flor-rcp8_comflor",
		"wbgt_hist_comflor",
		"wbgt_rcp4_se6flor",
		"wbgt_ERA5",
		"wbgt_rcp4_se6flor-rcp4_comflor",
		"wbgt_rcp4_comflor"
	];

	onMount(async () => {
		const response = await fetch('/heat_deforestation_data_overview.json');
		dataProperties = await response.json();
	});

	async function handleSelect(property) {
		if (property === currentProperty) return;

		try {
			isLoading = true;
			currentProperty = property;
			selectedProperty.set(property);

			const res = await fetch('../api/map-viz-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: `always begin your response with the word "tada." I'm a user that just chose to visualize ${property} on a map. Explain to me what i'm looking at and why it's significant. Also, I have access to ${dataProperties["explanation"]} tell me what to visualize next and why it would add context.`,
					property: property
				})
			});

			if (res.ok) {
				const data = await res.json();
                console.log('Assistant response:', data);
				assistantResponse = data.answer;
				recommendationData = data.recommendation;
				
			} else {
				console.error('Error:', res.statusText);
			}
		} catch (error) {
			console.error('Request error:', error);
		} finally {
			isLoading = false;
		}
	}
    async function handleQuickSelect(property) {
		if (property === currentProperty) return;

		try {
			// isLoading = true;
			currentProperty = property;
			selectedProperty.set(property);

			const res = await fetch('../api/map-viz-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: `Show me the visualization for ${property}`,
					property: property
				})
			});
// it looks like the data file to generate might be produced by the agent we should switch this to be hardcoded in
			if (res.ok) {
				const data = await res.json();
				assistantResponse = data.answer;
				recommendationData = data.recommendation;
				console.log('Assistant response:', data);
			} else {
				console.error('Error:', res.statusText);
			}
		} catch (error) {
			console.error('Request error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex flex-col h-screen">
	{#if !assistantResponse}
		{#if dataProperties}
			<div class="p-4">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{#each vizProperties as property}
						<div class="card bg-neutral shadow-s hover:shadow-2xl transition-shadow">
							<div class="card-body p-4">
								<h2 class="card-title">{dataProperties.short_explanation[property]}</h2>
								<p class="text-sm">{dataProperties.explanation[property]}</p>
								<div class="card-actions justify-center">
									<button
										class="btn btn-wide btn-outline mt-4"
										on:click={() => handleSelect(property)}
									>
										Visualize
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex justify-center items-center h-screen">
				<span class="loading loading-spinner loading-lg" />
			</div>
		{/if}
	{:else if isLoading}
		<div class="flex items-center justify-center flex-1">
			<div class="container mx-auto p-4">
				<h1 class="text-custom-intro mb-4 text-center">Generating map visualization...</h1>
				<div class="flex justify-center">
					<span class="loading loading-spinner loading-lg" />
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-1 overflow-hidden">
			<div class="w-2/3 shadow-xl rounded-lg overflow-hidden mx-1">
				<Map {mapData} class="w-full h-full" />
			</div>
			<div class="w-1/3 flex flex-col">
				<div class="h-2/3 shadow-xl rounded-lg overflow-scroll p-2 map-viz-card mx-1 mb-2">
					<h2 class="text-2xl mb-4 text-center title-font">Map Visualization Explanation</h2>
					<p>{assistantResponse}</p>
                    <p>{recommendationData}</p>
				</div>
				<div class="h-1/3 shadow-xl rounded-lg overflow-auto p-2 mx-1">
					<h3 class="text-lg mb-2 font-semibold">Switch Visualization</h3>
					<div class="space-y-0 max-h-full overflow-y-auto">
						{#each vizProperties as property}
							<div class="form-control">
								<label class="label cursor-pointer justify-start gap-2">
									<input
										type="radio"
										name="visualization"
										class="radio radio-primary"
										checked={currentProperty === property}
										on:change={() => handleQuickSelect(property)}
									/>
									<span class="label-text">
										{dataProperties?.short_explanation[property] || property}
									</span>
								</label>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

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
	.card {
		@apply backdrop-blur-sm bg-opacity-90;
	}
</style>