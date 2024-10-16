<script>
	import { onMount } from 'svelte';
	import { selectedAgentIndex, chatUsed } from '$lib/stores'; // Import the store

	// Component State
	const agents = [
		{
			name: 'Research Assistant',
			description: 'A knowledgeable research assistant to help you explore scientific literature',
			emoji: '🔬'
		},
		{
			name: 'Policy Expert',
			description: 'An expert on translating science into actionable policy',
			emoji: '📊'
		},
		{
			name: 'Teacher',
			description:
				'Your favorite teacher breaks down topics. Choose from kindergarten to graduate level',
			emoji: '🍎'
		}
	];
	
	// Reactive variable to get the selected agent from the store
	$: selectedAgent = agents[$selectedAgentIndex];
	$: unselectedAgents = agents.filter((_, index) => index !== $selectedAgentIndex);

	let isActive = false;
	let dropdownElement;

	// Functions to handle dropdown logic
	function toggleDropdown() {
		isActive = !isActive;
	}

	function selectOption(index) {
		selectedAgentIndex.set(index); // Update the store with the selected index
		isActive = false;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (dropdownElement && !dropdownElement.contains(event.target)) {
			isActive = false;
		}
	}

	// Attach event listener when component is mounted
	onMount(() => {
		return () => {
			// This cleanup function will be called when the component is destroyed
		};
	});

	// Add a reactive statement to close the dropdown when chat is used
	$: if ($chatUsed) {
		isActive = false;
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="agent-selection-container" class:chat-used={$chatUsed}>
	<div class="hero-select {isActive ? 'active' : ''}" bind:this={dropdownElement}>
		<div class="selected-option" on:click={toggleDropdown}>
			<span class="emoji">{selectedAgent.emoji}</span>
			<span id="selected-text" class:hidden={$chatUsed}>{selectedAgent.name}</span>
			<span class="dropdown-icon">&#x25BE;</span>
		</div>
		{#if isActive}
			<div class="options">
				{#each unselectedAgents as agent}
					<div
						class="option"
						on:click={() => selectOption(agents.findIndex(a => a.name === agent.name))}
					>
						<span class="emoji">{agent.emoji}</span>
						<span class="agent-name">{agent.name}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.agent-selection-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 20vh;
		height: 100vh;
		width: 100%;
		transition: all 0.3s ease-in-out;
	}

	.agent-selection-container.chat-used {
		justify-content: flex-start;
		align-items: flex-start;
		padding-top: 10px;
		padding-left: 10px;
		height: auto;
	}

	.hero-select {
		position: relative;
		text-align: left;
		width: 80%;
		max-width: 600px;
		transition: all 0.3s ease-in-out;
	}

	.chat-used .hero-select {
		width: auto;
		max-width: none;
	}

	.selected-option {
		font-size: 2.5vw;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		user-select: none;
		white-space: nowrap;
		transition: all 0.3s ease-in-out;
	}

	.chat-used .selected-option {
		font-size: 1rem;
		padding: 5px 10px;
		background-color: #f0f0f0;
		border-radius: 20px;
	}

	.emoji {
		margin-right: 10px;
	}

	.chat-used .emoji {
		margin-right: 0;
	}

	.dropdown-icon {
		margin-left: auto;
		transition: transform 0.3s;
		font-size: 0.8em;
	}

	.active .dropdown-icon {
		transform: rotate(180deg);
	}

	.options {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 5px;
		display: flex;
		flex-direction: column;
		/* background-color: white;
		border: 1px solid #ccc;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1); */
	}

	.option {
		font-size: 2.5vw;
		cursor: pointer;
		margin: 10px 0;
		opacity: 0;
		animation: fadeIn 0.3s forwards;
		white-space: nowrap;
		display: flex;
		align-items: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Remove text selection highlighting */
	.selected-option,
	.option {
		-webkit-tap-highlight-color: transparent;
	}

	/* Responsive Adjustments */
	@media (max-width: 768px) {
		.agent-selection-container {
			padding-top: 15vh;
		}
		.hero-select {
			width: 90%;
		}
		.selected-option {
			font-size: 5vw;
		}
		.chat-used .selected-option {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.agent-selection-container {
			padding-top: 10vh;
		}
		.selected-option {
			font-size: 6vw;
		}
		.chat-used .selected-option {
			font-size: 0.8rem;
		}
	}
</style>
