<script>
	import AgentChat from '$lib/components/AgentChat.svelte';
	import Sidebar from '$lib/components/AssistantSidebar.svelte';
	import DeforestationStats from '$lib/components/DeforestationStats.svelte';
	import Map from '$lib/components/Map.svelte';
	import MapAgent from '$lib/components/MapAgent.svelte';
	import { Coords } from '$lib/stores.js';
</script>

<main class="flex-1">
	<DeforestationStats />
	<div class="columns-2">
		<div>
			<Map />
		</div>
		<div>
			<MapAgent />
		</div>
	</div>
</main>
