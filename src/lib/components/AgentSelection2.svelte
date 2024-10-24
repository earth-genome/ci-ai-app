<script>
	import { selectedAgentIndex, chatUsed, input } from '$lib/stores'; // Import the store
	import { onMount } from 'svelte';

	$: isChatUsed = $chatUsed;
	$: selectedAgent = agents[$selectedAgentIndex];

	let isOpen = false;
	const agents = [
		{
			name: 'Researcher',
			description: 'A knowledgeable research assistant to help you explore scientific literature',
			emoji: '🔬',
			cards: [
				'Provide a comprehensive summary of how deforestation in the Amazon contributes to global carbon emissions, highlighting key findings from recent studies.',
				'Describe the methodologies employed in the papers that measure deforestation rates in the Amazon and analyze their impact on climate change. Include details on data sources, analytical techniques, and any innovative approaches.',
				'Compare the effectiveness of different policy interventions aimed at reducing deforestation in the Amazon as discussed in the available papers. Highlight which strategies have been most successful and the reasons behind their success.',
				'Based on the current literature, what are the major gaps in research regarding the relationship between Amazon deforestation and climate change? Suggest areas where further studies are needed.'
			]
		},
		{
			name: 'Policy Expert',
			description: 'An expert on translating science into actionable policy',
			emoji: '📊',
			cards: [
				'Based on the latest scientific findings, what evidence-based policy measures can governments implement to effectively reduce deforestation in the Amazon? Please ensure the recommendations address environmental sustainability and socio-economic impacts.',
				'Analyze the socio-economic consequences of Amazon deforestation as presented in recent studies. What policy interventions can mitigate negative impacts on local communities while promoting sustainable development?',
				'What policy strategies derived from current research can be employed to leverage Amazon rainforest conservation as a key component in global climate change mitigation efforts? Include considerations for feasibility and stakeholder engagement.',
				'Highlight the major gaps in existing research on Amazon deforestation and its climate change implications. What areas should future studies focus on to better inform and support the creation of effective policies?'
			]
		},
		{
			name: 'Teacher',
			description:
				'Your favorite teacher breaks down topics. Choose from kindergarten to graduate level',
			emoji: '🍎',
			cards: [
				'Can you explain how deforestation in the Amazon affects global climate change, using simple terms and examples?',
				'What are the key findings from recent studies on Amazon deforestation and its impact on climate, and how do they relate to our everyday lives?',
				'Why is the rate of deforestation in the Amazon important for climate change, and what can individuals do to help?',
				'How do the methods used in research on Amazon deforestation help us understand its relationship with climate change? Please provide a step-by-step explanation.'
			]
		}
	];

	let selectedText = `${agents[0].emoji} ${agents[0].name}`;
	$: selectedAgentIndex.set(0);

	let isFadingOut = false;

	let windowWidth;
    let windowHeight;

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
		selectedAgentIndex.set(agents.findIndex((agent) => agent.name === option.name));
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

	function handleCardClick(cardText) {
		input.set(cardText); // Set the input store value to the clicked card's text
		// Remove the line that sets chatUsed to true
	}

	function handleResize() {
		windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
	}

	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	const minWindowWidth = 1000;
	const minWindowHeight = 950;


	$: if ($chatUsed) {
		isOpen = false;
	}

	$: showDropdown = windowWidth > minWindowWidth && windowHeight > minWindowHeight;

	function truncateCard(text, wordCount = 3) {
		const words = text.split(' ');
		if (words.length <= wordCount) return text;
		return words.slice(0, wordCount).join(' ') + '...';
	}

	$: showFullCard = windowWidth > minWindowWidth && windowHeight > minWindowHeight;

	function handleSelectOption(agent) {
		selectOption(agent);
	}
</script>

<svelte:window on:click={handleWindowClick} on:resize={handleResize} />

{#if !isChatUsed}
	<div class="agent-selection-container">
		<div class="center-container">
				<div class="agent-selection-wrapper">
					{#if showDropdown}
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
									<polyline
										points="3,5 10,1 17,5"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<svg class="chevron-down" width="20" height="6" viewBox="0 0 20 6">
									<polyline
										points="3,1 10,5 17,1"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
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
												<span class="emoji">{agent.emoji}</span>
												{agent.name}
											</div>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					{:else}
						<details class="dropdown dropdown-top">
							<summary class="btn m-1">{selectedAgent.emoji} {selectedAgent.name}</summary>
							<ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
								{#each agents as agent}
									{#if agent.name !== selectedAgent.name}
										<li>
											<a on:click|preventDefault={() => handleSelectOption(agent)}>
												{agent.emoji} {agent.name}
											</a>
										</li>
									{/if}
								{/each}
							</ul>
						</details>
					{/if}
					<div class="agent-description">{selectedAgent.description}</div>
				</div>
			</div>

			<div class="cards-wrapper">
				<div class="cards-container">
					{#each selectedAgent.cards as card}
						<div
							class="agent-selection-card"
							on:click={() => handleCardClick(card)}
							on:keydown={(e) => e.key === 'Enter' && handleCardClick(card)}
							tabindex="0"
							role="button"
						>
							{#if showFullCard}
								{card}
							{:else}
								{truncateCard(card)}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	<!-- </div> -->
{:else}
	<div />
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

	/* Apply the font to the entire component */
	/* nest_comment_start~:global(body) {
		font-family: 'Roboto Mono', monospace; ~nest_comment_end */ /* Set the font for the body */ /* nest_comment_start~
	}~nest_comment_end */

	/* Styles for the outer container when chatUsed is false */
	.center-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 530px;
		margin: 0 auto;
	}

	.agent-selection-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding-bottom: 100px
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
		transition: transform 0.3s; ~nest_comment_end */ /* Smooth rotation transition */ /* nest_comment_start~
	}~nest_comment_end */

	/* nest_comment_start~.dropdown-icon.rotate {
		transform: rotate(180deg); ~nest_comment_end */ /* Rotate icon when dropdown is open */ /* nest_comment_start~
	}~nest_comment_end */

	/* Styles for the updated dropdown icon */
	.dropdown-icon {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 10px;
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

	.cards-wrapper {
		width: 100%;
		margin-top: 20px;
		padding-left: 10%; /* Add left padding */
		padding-right: 10%; /* Add right padding */
	}

	.cards-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		width: 100%;
	}

	.agent-selection-card {
		/* aspect-ratio: 1 / 1; */
		border: 1px solid #2f2f2f;
		border-radius: 8px;
		display: flex;
		align-items: flex-start; /* Changed from center to flex-start */
		justify-content: flex-start; /* Changed from center to flex-start */
		padding: 12px; /* Increased padding slightly */
		font-size: 0.7rem;
		font-family: 'Roboto Mono', monospace;
		text-align: left; /* Changed from center to left */
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		max-width: 250px;
		max-height: 250px;
		overflow: hidden;
	}

	.agent-selection-card:hover {
		transform: translateY(-3px); /* Reduced lift on hover */
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); /* Smaller shadow */
	}
</style>
