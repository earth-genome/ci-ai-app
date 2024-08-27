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
        return  Number(value).toFixed(decimals);
    }
</script>

<!-- create 2 columns -->
<div class="columns-2">
    <div class="stats-vertical shadow">
        <div class="stat">
			<div class="stat-title">Historical Change in Temp.</div>
			<div class="stat-figure text-accent">
				<Thermometer class="w-8 h-8" />
			</div>
			<div class="stat-value text-accent">                
				{roundNum($pointInfo.Delta_T, 2)}
			</div>
			<div class="stat-desc">
				Degrees Celsius between 2000-2019
			</div>
		</div>
    </div>
    <div class="stats-vertical shadow">
        <div class="stat">
			<div class="stat-title">Selected Location</div>
			<div class="stat-figure text-secondary">
				<MapPin class="w-8 h-8" />
			</div>
			<div class="stat-value text-secondary">                
				{roundNum($pointInfo['lat'], 3)}, {roundNum($pointInfo['lon'], 3)}
			</div>
			<div class="stat-desc">
				Latitude, Longitude
			</div>
		</div>
    </div>
	<div class="stats-vertical shadow">
		<div class="stat">
			<div class="stat-title">Local Deforestation (0-2km)</div>
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
			<div class="stat-title">Regional Deforestation (2-5km)</div>
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
			<div class="stat-title">Regional Deforestation (5-10km)</div>
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
			<div class="stat-title">Regional Deforestation (10-25km)</div>
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
			<div class="stat-title">Regional Deforestation (25-50km)</div>
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
			<div class="stat-title">Regional Deforestation (50-100km)</div>
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
<!-- 
<div class="stats shadow w-full">
	<div class="stat">
		<div class="stat-figure text-accent">
			<TreePine class="w-8 h-8" />
		</div>
		<div class="stat-title">Local Deforestation (0-2km)</div>
		<div class="stat-value text-accent">{formatPercentage($pointInfo.local_0_2km_end)}</div>
		<div class="stat-desc">
			{calculateChange($pointInfo, $pointInfo.local_0_2km_end)} change
		</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<MapPin class="w-8 h-8" />
		</div>
		<div class="stat-title">Regional Forest Cover (2-10km)</div>
		<div class="stat-value text-secondary">{formatPercentage($pointInfo.regional_2_10km_end)}</div>
		<div class="stat-desc">
			{calculateChange($pointInfo.regional_2_10km_start, $pointInfo.regional_2_10km_end)} change
		</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-accent">
			<TrendingDown class="w-8 h-8" />
		</div>
		<div class="stat-title">Deforestation Rate</div>
		<div class="stat-value text-accent">{formatPercentage($pointInfo.Delta_T)}</div>
		<div class="stat-desc">Estimated annual change</div>
	</div>
</div> -->

<!-- {
    "lat": "-2.6149999999999687",
    "lon": "-63.60499999999959",
    "Latitude_rescale": "0.5879842416283724",
    "Elevation_rescale": "0.1233402766159914",
    "Distance_coast_rescale": "0.7523246666684084",
    "local_0-2km_start": "1.0",
    "regional_2-5km_start": "1.0",
    "regional_5-10km_start": "1.0",
    "regional_10-25km_start": "1.0",
    "regional_25-50km_start": "1.0",
    "regional_50-100km_start": "0.99",
    "local_0-2km_end": "1.0",
    "regional_2-5km_end": "1.0",
    "regional_5-10km_end": "1.0",
    "regional_10-25km_end": "1.0",
    "regional_25-50km_end": "1.0",
    "regional_50-100km_end": "0.99",
    "Delta_T": "0.5260392829973048",
    "regional_2-10km_start": "1.0",
    "regional_2-10km_end": "1.0",
    "regional_10-100km_start": "0.9966666666666667",
    "regional_10-100km_end": "0.9966666666666667",
    "train_test_split": "train",
    "featureIndex": 71,
    "distanceToPoint": 8.518542489398152
}

Local deforestation (0-2km)
Regional deforestation (2-10km)
Regional deforestation (5-10km)
Regional deforestation (10-25km)
Regional deforestation (25-50km)
Greater region deforestation (50-100) -->

<style>
	/* You can add any additional styles here if needed */
</style>
