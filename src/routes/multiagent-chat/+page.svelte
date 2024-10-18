<script>
	import MultiAgentChat from '$lib/components/MultiAgentChat.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import Citations from '$lib/components/Citations.svelte';
	import AgentCustomization from '$lib/components/AgentCustomization.svelte';
    import AgentSelection from '$lib/components/AgentSelection2.svelte'
	import Map from '$lib/components/Map.svelte';
	import { Coords } from '$lib/stores.js';
</script>

<div class="main-container">
	<div class="sidebar">
		<div class="sidebar-top">
			<AgentCustomization />
		</div>
		<div class="sidebar-bottom">
			<Citations />
		</div>
	</div>
	<div class="chat-container">
		<div class="chat-messages">
            <AgentSelection />
			<MultiAgentChat />
		</div>
		<div class="chat-input-wrapper">
			<ChatInput />
		</div>
	</div>
</div>

<style>
	.main-container {
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 1rem;
		height: calc(100vh - 14vh); /* Assuming the header height is 10vh */
		padding: 1rem;
		box-sizing: border-box;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 100%;
	}

	.sidebar-top, .sidebar-bottom {
		border-radius: 8px;
		overflow: hidden;
	}

	.sidebar-top {
		flex: 0 0 auto;
	}

	.sidebar-bottom {
		flex: 1 1 0;
		min-height: 0; /* This is crucial for allowing the flex item to shrink below its content size */
		display: flex;
		flex-direction: column;
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		/* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
		overflow: hidden;
	}

	.chat-messages {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
        /* padding-left: 10rem; */
	}

	.chat-input-wrapper {
		padding: 1rem;
        /* padding-left: 10rem; */
	}
</style>
