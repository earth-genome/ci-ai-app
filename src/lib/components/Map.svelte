<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { Coords, pointInfo } from '$lib/stores.js';
	import * as turf from '@turf/turf';

	export let accessToken = PUBLIC_MAPBOX_TOKEN;
	export let center = [-62.2159, -3.4653];
	export let zoom = 3;

	let map;
	const dispatch = createEventDispatcher();

	onMount(() => {
		mapboxgl.accessToken = accessToken;
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/plotline/cm072jbsl00mj01ps9gcuexhn',
			center: center,
			zoom: zoom
		});

		map.on('click', (e) => {
			map.setFilter('filtered-data', null);
			Coords.set({ lat: e.lngLat.lat, lon: e.lngLat.lng });
			const bbox = [
				[e.point.x - 50, e.point.y - 50],
				[e.point.x + 50, e.point.y + 50]
			];

			const selectedFeatures = map.queryRenderedFeatures(bbox, {
				layers: ['full-historical-data']
			});

			if (selectedFeatures.length > 0) {
				// Convert the click point to a GeoJSON feature
				const clickPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);

				// Convert the selectedFeatures to a FeatureCollection
				const featureCollection = turf.featureCollection(
					selectedFeatures.map(feature => turf.point(feature.geometry.coordinates, feature.properties))
				);
				// find the nearest point
				const nearest = turf.nearestPoint(clickPoint, featureCollection);

				// reference this in other parts of the app if we want to refer to values
				pointInfo.set(nearest.properties);
				console.log('pointInfo:', $pointInfo);

				map.setFilter('filtered-data', [
					'all',
					['==', ['get', 'lat'], nearest.properties.lat],
					['==', ['get', 'lon'], nearest.properties.lon]
				]);

				// Highlight the nearest point
				map.setPaintProperty('full-historical-data', 'circle-radius', [
					'case',
					['all', 
						['==', ['get', 'lat'], nearest.properties.lat],
						['==', ['get', 'lon'], nearest.properties.lon]
					],
					10,
					1.464903086252076
				]);
				map.setPaintProperty('full-historical-data', 'circle-color', [
					'case',
					['all', 
						['==', ['get', 'lat'], nearest.properties.lat],
						['==', ['get', 'lon'], nearest.properties.lon]
					],
					'red',
					'#e8e8e8'
				]);
			}
		});

		return () => map.remove();
	});
</script>

<div id="map" />

<style>
	#map {
		width: 100%;
		height: 100%;
	}
</style>