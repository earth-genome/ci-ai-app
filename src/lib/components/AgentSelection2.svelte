<script>
	import { selectedAgentIndex, chatUsed } from '$lib/stores'; // Import the store
	import { onMount } from 'svelte';

	$: isChatUsed = $chatUsed;
	$: selectedAgent = agents[$selectedAgentIndex];

	let isOpen = false;
	const agents = [
		{
			name: 'Researcher',
			description: 'A knowledgeable research assistant to help you explore scientific literature',
			emoji: '🔬',
			cards: ['a', 'b', 'c', 'd']
		},
		{
			name: 'Policy Expert',
			description: 'An expert on translating science into actionable policy',
			emoji: '📊',
			cards: ['a', 'b', 'c', 'd']
		},
		{
			name: 'Teacher',
			description: 'Your favorite teacher breaks down topics. Choose from kindergarten to graduate level',
				emoji: '🍎',
			cards: ['a', 'b', 'c', 'd']
		}
	];

	let selectedText = `${agents[0].emoji} ${agents[0].name}`;
	$: selectedAgentIndex.set(0);

	let isFadingOut = false;

	function handleHover() {
		isOpen = true;
	}

	function toggleDropdown() {
		if (isOpen) {
			isFadingOut = true;
			setTimeout(() => {
				isOpen = !isOpen;
				isFadingOut = false;
			}, 300);
		} else {
			isOpen = !isOpen;
		}
	}

	function selectOption(option) {
		selectedText = `${option.emoji} ${option.name}`;
		selectedAgentIndex.set(agents.findIndex(agent => agent.name === option.name));
		isOpen = false;
	}

	function handleWindowClick(event) {
		if (!event.target.closest('.dropdown')) {
			isOpen = false;
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleDropdown();
		}
	}

	function handleOptionKeydown(event, option) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectOption(option);
		}
	}

	function handleMouseLeave() {
		isFadingOut = true;
		setTimeout(() => {
			isOpen = false;
			isFadingOut = false;
		}, 300);
	}

	onMount(() => {
		return () => {
			// This cleanup function will be called when the component is destroyed
		};
	});

	$: if ($chatUsed) {
		isOpen = false;
	}
</script>

<svelte:window on:click={handleWindowClick} />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

	/* Apply the font to the entire component */
	/* nest_comment_start~:global(body) {
		font-family: 'Roboto Mono', monospace; ~nest_comment_end *//* Set the font for the body *//* nest_comment_start~
	}~nest_comment_end */

	/* Styles for the outer container when chatUsed is false */
	.center-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.agent-selection-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 530px;
	}

	.dropdown {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 10px;
		cursor: pointer;
		background-color: transparent;
		border: none;
		border-radius: 10px;
		font-family: 'Roboto Mono', monospace;
	}

	.selected-text {
		flex-grow: 1;
		margin-right: 10px;
		font-size: 3rem;
		white-space: nowrap;
		font-family: 'Roboto Mono', monospace;
	}

	/* nest_comment_start~.dropdown-icon {
		width: 16px;
		height: 16px;
		transition: transform 0.3s; ~nest_comment_end *//* Smooth rotation transition *//* nest_comment_start~
	}~nest_comment_end */

	/* nest_comment_start~.dropdown-icon.rotate {
		transform: rotate(180deg); ~nest_comment_end *//* Rotate icon when dropdown is open *//* nest_comment_start~
	}~nest_comment_end */

/* Styles for the updated dropdown icon */
    .dropdown-icon {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 10px
    }

    .chevron-up,
    .chevron-down {
        display: block;
    }

    .chevron-up {
        margin-bottom: 6px;
    }

    .chevron-down {
        margin-top: 6px;
    }

	.options {
		font-size: 3rem;
		position: absolute;
		bottom: 100%;
		left: 0;
		width: 100%;
		margin-top: 5px;
		animation: fadeIn 0.3s forwards;
		opacity: 1;
	}

	.options.fade-out {
		animation: fadeOut 0.3s forwards;
		opacity: 0;
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

	@keyframes fadeOut {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	.option {
		padding: 10px;
		cursor: pointer;
		transition: font-size 0.3s, transform 0.3s;
		font-size: 3rem;
	}

	.option:hover {
		font-size: 3.2rem;
		transform: translateY(-5px);
	}

	.agent-description {
		font-size: 1.5rem;
		color: #666;
		margin-top: 5px;
	}

	.cards-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 20px;
		width: 100%;
	}

	.agent-selection-card {
		width: calc(25% - 10px);
		/* aspect-ratio: 1 / 1; */
		border: 1px solid #2f2f2f;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-family: 'Roboto Mono', monospace;
	}
</style>

{#if !isChatUsed}
	<div class="center-container">
		<div class="agent-selection-wrapper">
			<div
				class="dropdown"
				on:click|stopPropagation={toggleDropdown}
				on:keydown={handleKeydown}
				on:mouseenter={handleHover}
				on:mouseleave={handleMouseLeave}
				tabindex="0"
				role="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<span class="selected-text">{selectedText}</span>
				<span class="dropdown-icon">
					<svg class="chevron-up" width="20" height="6" viewBox="0 0 20 6">
						<polyline points="3,5 10,1 17,5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					<svg class="chevron-down" width="20" height="6" viewBox="0 0 20 6">
						<polyline points="3,1 10,5 17,1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</span>

				{#if isOpen}
					<div class="options" role="listbox" class:fade-out={isFadingOut}>
						{#each agents as agent (agent.name)}
							{#if agent.name !== selectedAgent.name}
								<div
									class="option"
									role="option"
									tabindex="0"
									on:click|stopPropagation={() => selectOption(agent)}
									on:keydown={(e) => handleOptionKeydown(e, agent)}
									aria-selected={selectedText === `${agent.emoji} ${agent.name}`}
								>
									<span class="emoji">{agent.emoji}</span> {agent.name}
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
			<div class="agent-description">{selectedAgent.description}</div>

			<div class="cards-container">
				{#each selectedAgent.cards as card}
					<div class="agent-selection-card">
						{card}
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div></div>
{/if}
