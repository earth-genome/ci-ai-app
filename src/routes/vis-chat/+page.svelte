<script>
	import VisChat from '$lib/components/VisChat.svelte';
	import Citations from '$lib/components/Citations.svelte';
	// import Sidebar from '$lib/components/AssistantSidebar.svelte';
	import Map from '$lib/components/Map.svelte';
	import { Coords } from '$lib/stores.js';
</script>

<main class="flex-1">
	<div class="grid grid-cols-2">
		<div>
			<VisChat />
		</div>
		<div>
			<Citations />
		</div>
		<!-- <Map /> -->
	</div>
</main>
