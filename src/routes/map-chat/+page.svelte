<script>
	import AgentChat from '$lib/components/AgentChat.svelte';
	import Sidebar from '$lib/components/AssistantSidebar.svelte';
	import DeforestationStats from '$lib/components/DeforestationStats.svelte';
	import Map from '$lib/components/Map.svelte';
	import { Coords } from '$lib/stores.js';
</script>

<main class="flex-1">
	<div class="columns-2">
		<div>
			<Map />
		</div>
		<div>
			<DeforestationStats />
		</div>
	</div>
</main>
