<script>
	import { pointInfo } from '$lib/stores';
	import { TreePine, MapPin, Thermometer } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { currentCitations } from '$lib/stores';
	import { assistantDefinitions } from '$lib/assistant-definition.js';

	function formatPercentage(value) {
		return (parseFloat(value) * 100).toFixed(1) + '%';
	}

	function calculateChange(start, end) {
		const change = (parseFloat(end) - parseFloat(start)) * 100;
		return change.toFixed(1) + '%';
	}

	function roundNum(value, decimals) {
		return Number(value).toFixed(decimals);
	}
</script>

<div class="overflow-x-auto">
	<div class="flex space-x-4 py-0 px-2 min-w-max">
		<div class="flex flex-col items-center w-32">
			<Thermometer class="w-5 h-5 mb-2" />
			<div class="text-xl font-bold">{roundNum($pointInfo.Delta_T, 2)}°C</div>
			<div class="text-sm  text-center">Temp Change 2000-2019</div>
		</div>

		<div class="flex flex-col items-center w-32">
			<MapPin class="w-5 h-5 mb-2" />
			<div class="text-l font-bold">{roundNum($pointInfo['lat'], 3)}, {roundNum($pointInfo['lon'], 3)}</div>
			<div class="text-sm  text-center">Latitude, Longitude</div>
		</div>

		{#each [
			{ range: '0-2km', start: 'local_0-2km_start', end: 'local_0-2km_end', label: 'Local' },
			{ range: '2-5km', start: 'regional_2-5km_start', end: 'regional_2-5km_end', label: 'Regional' },
			{ range: '5-10km', start: 'regional_5-10km_start', end: 'regional_5-10km_end', label: 'Regional' },
			{ range: '10-25km', start: 'regional_10-25km_start', end: 'regional_10-25km_end', label: 'Regional' },
			{ range: '25-50km', start: 'regional_25-50km_start', end: 'regional_25-50km_end', label: 'Regional' },
			{ range: '50-100km', start: 'regional_50-100km_start', end: 'regional_50-100km_end', label: 'Regional' }
		] as item}
			<div class="flex flex-col items-center w-32">
				<TreePine class="w-5 h-5 mb-2" />
				<div class="text-xl font-bold">{calculateChange($pointInfo[item.start], $pointInfo[item.end])}</div>
				<div class="text-sm  text-center">Deforestation ({item.range})</div>
			</div>
		{/each}
	</div>
</div>