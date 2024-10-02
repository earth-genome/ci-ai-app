<script>
	import MultiAgentChat from '$lib/components/MultiAgentChat.svelte';
	import Citations from '$lib/components/Citations.svelte';
	// import Sidebar from '$lib/components/AssistantSidebar.svelte';
	import Map from '$lib/components/Map.svelte';
	import { Coords } from '$lib/stores.js';

	// Set the theme on the body element when the component mounts
	// import { onMount } from 'svelte';
	// onMount(() => {
	// 	document.body.setAttribute('data-theme', 'retro');
	// });
</script>

<main>
	<!-- <div class="grid grid-cols-3"> -->
		<!-- <div class="col-span-2"> -->
    <MultiAgentChat />
		<!-- </div>
	</div> -->
</main>

