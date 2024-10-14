<script>
	import MultiAgentChat from '$lib/components/MultiAgentChat.svelte';
	import Citations from '$lib/components/Citations.svelte';
    import AgentCustomization from '$lib/components/AgentCustomization.svelte';
	import Map from '$lib/components/Map.svelte';
	import { Coords } from '$lib/stores.js';

</script>

<main>
	<div class="grid grid-cols-4">
        <div class="col-span-1">
            <AgentCustomization />
            <Citations />
        </div>
		<div class="col-span-3">
            <MultiAgentChat />
		</div>
	</div>
</main>

