<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { selectedProperty } from '$lib/stores.js';

	export let accessToken = PUBLIC_MAPBOX_TOKEN;
	export let center = [-62.2159, -3.4653];
	export let zoom = 3;

	let dataProperties;

	onMount(async () => {
        const response = await fetch('/heat_deforestation_data_overview.json');
        dataProperties = await response.json();
		console.log(dataProperties);
    });

	let map;
	let currentProperty;
    selectedProperty.subscribe(value => {
        currentProperty = value;
		console.log("currentProperty: ", currentProperty);
        // Update the map layer if it exists
        if (map && map.getLayer('researchData')) {
            map.setPaintProperty('researchData', 'fill-color', [
                "interpolate", ["linear"], ["get", currentProperty],
                dataProperties['min'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#2b83ba", "rgba(255, 255, 255, 0)"],
                dataProperties['25%'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#abdda4", "rgba(255, 255, 255, 0)"],
                dataProperties['mean'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#ffffbf", "rgba(255, 255, 255, 0)"],
                dataProperties['75%'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#fdae61", "rgba(255, 255, 255, 0)"],
                dataProperties['max'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#d7191c", "rgba(255, 255, 255, 0)"]
            ]);
        }
    });
	const dispatch = createEventDispatcher();

	onMount(() => {
		mapboxgl.accessToken = accessToken;
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/plotline/cm1v19tkd01c601rba4mcekli',
			center: center,
			zoom: zoom
		});
		map.on('load', () => {
			map.addSource('researchData', {
				type: 'geojson',
				data: '/heat_risk_deforestation.geojson'
			});
			map.addLayer({
                id: 'researchData',
                type: 'fill',
                source: 'researchData',
                paint: {
                    "fill-color": [
                        "interpolate", ["linear"], ["get", currentProperty],
                		dataProperties['min'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#2b83ba", "rgba(255, 255, 255, 0)"],
                		dataProperties['25%'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#abdda4", "rgba(255, 255, 255, 0)"],
                		dataProperties['mean'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#ffffbf", "rgba(255, 255, 255, 0)"],
                		dataProperties['75%'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#fdae61", "rgba(255, 255, 255, 0)"],
                		dataProperties['max'][currentProperty], ["case", ["!=", ["get", currentProperty], 0], "#d7191c", "rgba(255, 255, 255, 0)"]
                    ],
                    "fill-opacity": 0.53
                }
            });
		});

		// map.on('click', (e) => {});

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