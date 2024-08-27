<script>
	import AgentChat from '$lib/components/AgentChat.svelte';
	import Sidebar from '$lib/components/AssistantSidebar.svelte';
	import Map from '$lib/components/Map.svelte';
	import { Coords } from '$lib/stores.js';
</script>

<main class="flex-1">
	<div class="columns-2">
		<Map />
		<div>
			<AgentChat />
		</div>
	</div>
</main>
