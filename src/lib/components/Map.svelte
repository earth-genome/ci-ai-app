<script>
	// Map.svelte
	import { onMount, createEventDispatcher } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { selectedProperty } from '$lib/stores.js';

	export let accessToken = PUBLIC_MAPBOX_TOKEN;
	export let center = [-62.2159, -3.4653];
	export let zoom = 3;

	let map;
	let currentProperty;
	let dataProperties;

	// Move the data fetch to a separate function
	async function fetchDataProperties() {
		const response = await fetch('/heat_deforestation_data_overview.json');
		dataProperties = await response.json();
		return dataProperties;
	}

	// Create a function to update the map style
	function updateMapStyle(map, property, properties) {
		if (map && map.getLayer('researchData') && properties) {
			map.setPaintProperty('researchData', 'fill-color', [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				'#7B338A', // hover color
				// Your default color interpolation
				[
					'interpolate',
					['linear'],
					['get', currentProperty],
					dataProperties['min'][currentProperty],
					['case', ['!=', ['get', currentProperty], 0], '#2b83ba', 'rgba(255, 255, 255, 0)'],
					dataProperties['25%'][currentProperty],
					['case', ['!=', ['get', currentProperty], 0], '#abdda4', 'rgba(255, 255, 255, 0)'],
					dataProperties['mean'][currentProperty],
					['case', ['!=', ['get', currentProperty], 0], '#ffffbf', 'rgba(255, 255, 255, 0)'],
					dataProperties['75%'][currentProperty],
					['case', ['!=', ['get', currentProperty], 0], '#fdae61', 'rgba(255, 255, 255, 0)'],
					dataProperties['max'][currentProperty],
					['case', ['!=', ['get', currentProperty], 0], '#d7191c', 'rgba(255, 255, 255, 0)']
				]
			]);
		}
	}

	selectedProperty.subscribe(async (value) => {
		currentProperty = value;
		// Ensure we have the data properties before updating
		if (!dataProperties) {
			dataProperties = await fetchDataProperties();
		}
		updateMapStyle(map, currentProperty, dataProperties);
	});

	onMount(async () => {
		// Fetch data properties first
		dataProperties = await fetchDataProperties();

		mapboxgl.accessToken = accessToken;
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/plotline/cm1v19tkd01c601rba4mcekli',
			center: center,
			zoom: zoom
		});

		map.on('load', () => {
			map.addSource('researchDataSource', {
				type: 'geojson',
				data: '/heat_risk_deforestation.geojson',
				generateId: true
			});

			map.addLayer({
				id: 'researchData',
				type: 'fill',
				source: 'researchDataSource',
				paint: {
					'fill-color': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						'#7B338A', // hover color
						// Your default color interpolation
						[
							'interpolate',
							['linear'],
							['get', currentProperty],
							dataProperties['min'][currentProperty],
							['case', ['!=', ['get', currentProperty], 0], '#2b83ba', 'rgba(255, 255, 255, 0)'],
							dataProperties['25%'][currentProperty],
							['case', ['!=', ['get', currentProperty], 0], '#abdda4', 'rgba(255, 255, 255, 0)'],
							dataProperties['mean'][currentProperty],
							['case', ['!=', ['get', currentProperty], 0], '#ffffbf', 'rgba(255, 255, 255, 0)'],
							dataProperties['75%'][currentProperty],
							['case', ['!=', ['get', currentProperty], 0], '#fdae61', 'rgba(255, 255, 255, 0)'],
							dataProperties['max'][currentProperty],
							['case', ['!=', ['get', currentProperty], 0], '#d7191c', 'rgba(255, 255, 255, 0)']
						]
					],
					'fill-opacity': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						0.8, // hover opacity
						0.53 // default opacity
					]
				}
			});
			let hoveredStateId = null;

			map.on('mousemove', 'researchData', (e) => {
				if (e.features.length > 0) {
					map.getCanvas().style.cursor = 'pointer';

					if (hoveredStateId !== null) {
						// Remove hover state from previous feature
						map.setFeatureState(
							{ source: 'researchDataSource', id: hoveredStateId },
							{ hover: false }
						);
					}
					console.log(e.features[0]);

					hoveredStateId = e.features[0].id; // Make sure your features have an id property

					// Set hover state on current feature
					map.setFeatureState(
						{ source: 'researchDataSource', id: hoveredStateId },
						{ hover: true }
					);
				}
			});
			map.on('mouseleave', 'researchData', () => {
				map.getCanvas().style.cursor = '';

				if (hoveredStateId !== null) {
					map.setFeatureState(
						{ source: 'researchDataSource', id: hoveredStateId },
						{ hover: false }
					);
				}
				hoveredStateId = null;
			});
			map.on('click', 'researchData', (e) => {
				const coordinates = e.lngLat;
				const description = e.features[0].properties[currentProperty];
				new mapboxgl.Popup()
					.setLngLat(coordinates)
					.setHTML(
						// `<div class="p-4 bg-neutral rounded-box shadow-lg">
							`<h3 class="text-sm font-semibold text-gray-600">${dataProperties.short_explanation[currentProperty]}</h3>
							<p class="text-sm text-gray-500">Value: ${description}</p>`
						// </div>`
					)
					.addTo(map);
			});
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
