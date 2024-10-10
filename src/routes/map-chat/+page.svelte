<script>
	import AgentChat from '$lib/components/AgentChat.svelte';
	import Sidebar from '$lib/components/AssistantSidebar.svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import DeforestationStats from '$lib/components/DeforestationStats.svelte';
	import Map from '$lib/components/Map.svelte';
	import MapAgent from '$lib/components/MapAgent.svelte';
	import { Coords } from '$lib/stores.js';
	import { onMount } from 'svelte';

	let isMobile = false;

	function checkMobile() {
		isMobile = window.innerWidth < 768; // Adjust this breakpoint as needed
	}

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});
</script>

<main class="flex-1">
	<div class="h-screen flex flex-col">
		<div class="card shadow-xl h-[15vh] w-full overflow-y-auto p-0">
		  <div class="card-body m-1 p-0">
			<DeforestationStats />
		  </div>
		</div>
	  
		<div class="flex-1 flex {isMobile ? 'flex-col' : 'flex-row'} overflow-hidden">
		  <div class="card shadow-xl {isMobile ? 'h-[42.5vh]' : 'w-1/2'} overflow-y-auto m-1">
			<div class="card-body p-0">
				<Map />
			</div>
		  </div>
	  
		  <div class="card  shadow-xl {isMobile ? 'h-[42.5vh]' : 'w-1/2'} overflow-y-auto m-1">
			<div class="card-body p-2">
				<MapAgent />
			</div>
		  </div>
		</div>
	  </div>
</main>
