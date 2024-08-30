<script>
	import { pointInfo } from '$lib/stores';
	import { TreePine, MapPin, TrendingDown, Thermometer } from 'lucide-svelte';
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
	console.log($pointInfo);
</script>

<div class="stats shadow m-2 bg-neutral-content">
	<div class="stat">
		<div class="stat-title">Historical Change in Temp.</div>
		<div class="stat-figure text-accent">
			<Thermometer class="w-8 h-8" />
		</div>
		<div class="stat-value text-accent">
			{roundNum($pointInfo.Delta_T, 2)}
		</div>
		<div class="stat-desc">Degrees Celsius between 2000-2019</div>
	</div>
</div>
<div class="stats shadow m-2 bg-neutral-content">
	<div class="stat">
		<div class="stat-title">Selected Location</div>
		<div class="stat-figure text-secondary">
			<MapPin class="w-8 h-8" />
		</div>
		<div class="stat-value text-secondary">
			{roundNum($pointInfo['lat'], 3)}, {roundNum($pointInfo['lon'], 3)}
		</div>
		<div class="stat-desc">Latitude, Longitude</div>
	</div>
</div>
<div class="overflow-x-auto">
	<div class="stats shadow bg-neutral-content m-2">
		<div class="stat">
			<div class="stat-title">Deforestation (0-2km)</div>
			<div class="stat-figure text-primary">
				<TreePine class="w-8 h-8" />
			</div>
			<div class="stat-value">
				{calculateChange($pointInfo['local_0-2km_start'], $pointInfo['local_0-2km_end'])}
			</div>
			<div class="stat-desc">
				{formatPercentage($pointInfo['local_0-2km_end'])} Local Forest Cover
			</div>
		</div>
		<div class="stat">
			<div class="stat-title">Deforestation (2-5km)</div>
			<div class="stat-figure text-primary">
				<TreePine class="w-8 h-8" />
			</div>
			<div class="stat-value">
				{calculateChange($pointInfo['regional_2-5km_start'], $pointInfo['regional_2-5km_end'])}
			</div>
			<div class="stat-desc">
				{formatPercentage($pointInfo['regional_2-5km_end'])} Regional Forest Cover
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Deforestation (5-10km)</div>
			<div class="stat-figure text-primary">
				<TreePine class="w-8 h-8" />
			</div>
			<div class="stat-value">
				{calculateChange($pointInfo['regional_5-10km_start'], $pointInfo['regional_5-10km_end'])}
			</div>
			<div class="stat-desc">
				{formatPercentage($pointInfo['regional_5-10km_end'])} Regional Forest Cover
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Deforestation (10-25km)</div>
			<div class="stat-figure text-primary">
				<TreePine class="w-8 h-8" />
			</div>
			<div class="stat-value">
				{calculateChange($pointInfo['regional_10-25km_start'], $pointInfo['regional_10-25km_end'])}
			</div>
			<div class="stat-desc">
				{formatPercentage($pointInfo['regional_10-25km_end'])} Regional Forest Cover
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Deforestation (25-50km)</div>
			<div class="stat-figure text-primary">
				<TreePine class="w-8 h-8" />
			</div>
			<div class="stat-value">
				{calculateChange($pointInfo['regional_25-50km_start'], $pointInfo['regional_25-50km_end'])}
			</div>
			<div class="stat-desc">
				{formatPercentage($pointInfo['regional_25-50km_end'])} Regional Forest Cover
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Deforestation (50-100km)</div>
			<div class="stat-figure text-primary">
				<TreePine class="w-8 h-8" />
			</div>
			<div class="stat-value">
				{calculateChange(
					$pointInfo['regional_50-100km_start'],
					$pointInfo['regional_50-100km_end']
				)}
			</div>
			<div class="stat-desc">
				{formatPercentage($pointInfo['regional_50-100km_end'])} Regional Forest Cover
			</div>
		</div>
	</div>
</div>

<style>
</style>
