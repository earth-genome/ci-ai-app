<script>
	import AgentChat from '$lib/components/AgentChat.svelte';
	import Sidebar from '$lib/components/AssistantSidebar.svelte';
</script>

<div class="flex">
	<Sidebar />
	<main class="flex-1">
		<AgentChat />
	</main>
</div>
