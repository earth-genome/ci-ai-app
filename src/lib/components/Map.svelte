<script>
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import 'mapbox-gl/dist/mapbox-gl.css';
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

  
    export let accessToken = PUBLIC_MAPBOX_TOKEN;

    export let center = [-62.2159, -3.4653];
    export let zoom = 9;
  
    let mapContainer;
  
    onMount(() => {
      mapboxgl.accessToken = accessToken;
      const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/plotline/cm072jbsl00mj01ps9gcuexhn',
        center: center,
        zoom: zoom
      });
  
      return () => map.remove();
    });
  </script>
  
  <div bind:this={mapContainer} style="width: 100%; height: 100vw;"></div>