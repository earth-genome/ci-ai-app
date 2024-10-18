<script>
	import { selectedAgentIndex, chatUsed } from '$lib/stores'; // Import the store
	import { onMount } from 'svelte';

	// Subscribe to the chatUsed store
	$: isChatUsed = $chatUsed;
	$: selectedAgent = agents[$selectedAgentIndex];

	// Set default selected text to include emoji
	let isOpen = false;
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

	let selectedText = `${agents[0].emoji} ${agents[0].name}`; // Include emoji in the selected text
	$: selectedAgentIndex.set(0); // Set the default selected agent index

	let isFadingOut = false; // New state to track fading out

	function handleHover() {
		isOpen = true;
	}

	function toggleDropdown() {
		if (isOpen) {
			isFadingOut = true; // Set fading out state when closing
			setTimeout(() => {
				isOpen = !isOpen; // Toggle open state after fade-out
				isFadingOut = false; // Reset fading out state
			}, 300); // Match this duration with the fade-out animation duration
		} else {
			isOpen = !isOpen; // Just toggle open state if opening
		}
	}

	function selectOption(option) {
		selectedText = `${option.emoji} ${option.name}`; // Update selected text with emoji
		selectedAgentIndex.set(agents.findIndex(agent => agent.name === option.name)); // Update selectedAgentIndex
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
		isFadingOut = true; // Set fading out state when mouse leaves
		setTimeout(() => {
			isOpen = false; // Close dropdown after fade-out
			isFadingOut = false; // Reset fading out state
		}, 300); // Match this duration with the fade-out animation duration
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

<!-- Listen for clicks on the window to close the dropdown when clicking outside -->
<svelte:window on:click={handleWindowClick} />

<style>
	/* Styles for the outer container when chatUsed is false */
	.center-container {
		display: flex;
		align-items: center;     /* Vertical centering */
		justify-content: center; /* Horizontal centering */
		height: 100%;            /* Full height of the parent */
	}

	.dropdown {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 530px; /* Increase width to accommodate larger text */
		padding: 10px;
		cursor: pointer;
		margin: 0 auto; /* Center horizontally when needed */
		background-color: transparent; /* No background */
		border: none; /* No border */
		/* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); */
		border-radius: 10px;
	}

	.selected-text {
		flex-grow: 1;
		margin-right: 10px;
		font-size: 3rem; /* Increase font size */
		white-space: nowrap; /* Prevent text from wrapping */
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
        margin-bottom: 6px; /* Increased spacing between chevrons */
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
		opacity: 1; /* Default opacity */
	}

	.options.fade-out {
		animation: fadeOut 0.3s forwards; /* Apply fade-out animation */
		opacity: 0; /* Set opacity to 0 for fade-out */
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
		transition: font-size 0.3s, transform 0.3s; /* Smooth transition for font size and movement */
		font-size: 3rem; /* Base font size */
	}

	.option:hover {
		font-size: 3.2rem; /* Increase font size on hover */
		transform: translateY(-5px); /* Optional: Slight upward movement */
	}
</style>

<!-- Conditional class application based on the chatUsed flag -->
<div class="{isChatUsed ? '' : 'center-container'}">
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
		<!-- <span class="dropdown-icon {isOpen ? 'rotate' : ''}">▼</span> -->
<!-- Updated dropdown icon -->
        <span class="dropdown-icon">
            <svg class="chevron-up" width="24" height="6" viewBox="0 0 24 6">
                <polyline points="2,5 12,1 22,5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="chevron-down" width="24" height="6" viewBox="0 0 24 6">
                <polyline points="2,1 12,5 22,1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>

		{#if isOpen}
			<div class="options" role="listbox" class:fade-out={isFadingOut}>
				{#each agents as agent (agent.name)} <!-- Use unique key for each agent -->
					{#if agent.name !== selectedAgent.name} <!-- Exclude the selected agent -->
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
</div>
