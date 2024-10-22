<script>
	import MultiAgentChat from '$lib/components/MultiAgentChat.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import Citations from '$lib/components/Citations.svelte';
	import AgentCustomization from '$lib/components/AgentCustomization.svelte';
    import AgentSelection from '$lib/components/AgentSelection2.svelte'
	import Map from '$lib/components/Map.svelte';
	import { Coords, chatUsed } from '$lib/stores.js';
	import { onMount } from 'svelte';

	let helpModal;

	onMount(() => {
		if (helpModal) {
			helpModal.showModal();
		}
	});
</script>

<div class="main-container">
	<div class="sidebar">
		<!-- Use bind:this to get a reference to the dialog element -->
		<button class="btn" on:click={() => helpModal.showModal()}>What is CI Research Chat?</button>
		<dialog bind:this={helpModal} class="modal">
			<div class="modal-box prose">
				<h3 class="text-lg font-bold">Welcome!</h3>
				<p class="py-4">
					Explore the research powering <a href="https://www.wri.org/research/not-just-carbon-capturing-benefits-forests-climate">Conservation International's Not Just Carbon report</a> in a conversational manner.
					CI Research Chat (CI AI) is a machine intelligence that has deep knowledge on the research behind the Not Just Carbon report. Ask it about anything topic related to the report, or climate change at large, and CI AI will reference over 100 documents to answer your question, citing its sources.<br><br>
					
					The list of papers being used by CI AI is on the left. You can search for a publication using the search bar, and clicking the citation will insert its reference into the chat window.
					Click the citations in a response to open the document in a new tab. <br><br>

					Explore the three different specialties to view the data from different perspectives. Suggested prompts below the speciality description demonstrate what can be asked of each specialied AI - click to insert the prompt into the chat, or try asking your own question.
				</p>
				<div class="modal-action">
					<form method="dialog">
						<button class="btn">Close</button>
					</form>
				</div>
			</div>
		</dialog>
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
			{#if $chatUsed}
				<div class="multi-agent-chat-wrapper">
					<MultiAgentChat />
				</div>
			{/if}
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
		min-height: 0;
		display: flex;
		flex-direction: column;
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 8px;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}

	.chat-messages {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end; /* This will align content to the bottom */
		overflow: hidden;
		width: 100%;
		/* max-width: 750px; */
	}

	.multi-agent-chat-wrapper {
		flex-grow: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column-reverse;
		width: 100%;
		/* max-width: 780px; */
	}

	.chat-input-wrapper {
		padding: 1rem;
		max-width: 850px;
		width: 100%;
	}
</style>
