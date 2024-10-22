<script>
	import { onMount } from 'svelte';
	import userAvatar from '$lib/images/ci.png';
	import { currentCitations, chatHistory, isLoading, chatUsed, selectedAgentIndex } from '$lib/stores';
	import { textEditorContent } from '$lib/stores.js';

	let cardTexts = [
		'<b>Research assistant:</b> A knowledgeable research assistant to help you explore scientific literature',
		'<b>Policy expert:</b> An expert on translating science into actionable policy',
		'<b>Teacher:</b> Your favorite teacher breaks down topics. Choose from kindergarten to graduate level'
	];

	const emojis = ['🔬','📊','🍎'];

	cardTexts = cardTexts.map((text, index) => {
		const figureText = `
			<figure>
				<span style="font-size: 4rem">${emojis[index]}</span>
			</figure>
		`;
		return figureText + text;
	});
	function handleCardClick(index) {
		selectedAgentIndex.set(index);
	}

	// create a derived store for the last message
	$: lastMessage = $chatHistory[$chatHistory.length - 1];

</script>

<div class="chat-container">
	<!-- <div class="cards-container {$chatUsed ? 'cards-top' : 'cards-center'}">
		{#each cardTexts as text, index}
			<button
				class="card bg-base-100 image-full w-96 shadow-xl {$selectedAgentIndex === index ? 'selected' : ''}"
				on:click={() => handleCardClick(index)}
				on:keydown={(e) => e.key === 'Enter' && handleCardClick(index)}
			>
				{@html text}
			</button>
		{/each}
	</div> -->
	<div class="messages">
		{#each $chatHistory as message}
			<div class={message.role === 'user' ? 'user-question' : 'assistant-response'}>
				{#if message.role === 'assistant'}
					<div class="avatar assistant-avatar">
						<span class="emoji">{emojis[$selectedAgentIndex]}</span>
					</div>
				{/if}
				<div class="message-content {message.role}">
					{#if message.role === 'assistant' && $isLoading && message === lastMessage}
						<span class="loading loading-dots loading-lg" />
					{:else}
						<div class="rendered-html prose">
							{@html message.content}
						</div>
					{/if}
				</div>
				{#if message.role === 'user'}
					<div class="avatar user-avatar">
						<img src={userAvatar} alt="User icon" />
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.chat-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: relative;
	}

	.messages {
		flex-grow: 1;
		overflow-y: auto;
		border-radius: 15px;
		padding: 10px;
		padding-bottom: 60px;
	}

	.user-question, .assistant-response {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.user-question {
		justify-content: flex-end;
	}

	.assistant-response {
		justify-content: flex-start;
	}

	.avatar {
		width: 40px;
		height: 40px;
		margin: 5px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.user-avatar {
		background-color: #F1E9D2;
		padding: 5px;
	}

	.user-avatar img {
		max-width: 80%;
		max-height: 80%;
	}

	.assistant-avatar {
		background-color: #F1E9D2;
	}

	.assistant-avatar .emoji {
		font-size: 24px;
	}

	.message-content {
		background-color: #2C665D;
        color: #F1E9D2;
		padding: 10px 20px;
		border-radius: 20px; /* Rounded corners */
		max-width: 70%; /* Limit the width of the message content */
		word-wrap: break-word; /* Ensure long words break to the next line */
	}

	.loading-icon {
		color: #003e24;
	}

	:global(.code-card) {
		background-color: #2d2d2d;
		border-radius: 5px;
		margin-top: 10px;
		overflow-x: auto;
		border: 1px solid #444;
	}

	:global(.code-card-header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #1e1e1e;
		padding: 5px 10px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		color: #ffffff;
	}

	:global(.code-language) {
		font-size: 0.9em;
		color: #9cdcfe;
	}

	:global(.copy-button) {
		background: none;
		border: none;
		color: #9cdcfe;
		cursor: pointer;
		font-size: 0.9em;
	}

	:global(.copy-button:hover) {
		color: #ffffff;
	}

	:global(.code-card pre) {
		margin: 0;
		padding: 10px;
		background-color: #2d2d2d;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		width:40vw
	}

	:global(.inline-code) {
		background-color: #dadada;
		padding: 2px 4px;
		border-radius: 3px;
	}

	.cards-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		width: 90%; /* Make the container responsive */
		transition: top 0.3s, transform 0.3s; /* Smooth transition */
		position: relative; /* Ensure it can be layered on top */
		z-index: 1; /* Ensure it sits above other elements */
	}

	.cards-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.cards-top {
		position: relative;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}

	.card {
		background-color: #A3C18A;
		color: #4A403A;
		padding: 15px;
		border-radius: 15px;
		text-align: center;
		flex: 1;
		max-width: 240px;
		max-height: 220px;
		aspect-ratio: 1 / 1;
		cursor: pointer;
		transition: background-color 0.3s, box-shadow 0.3s;
		margin: 0 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #e0e0e0;
		--tw-shadow: 0 0 2px 0 rgba(0, 0, 0, .05), 0 4px 6px 0 rgba(0, 0, 0, .02);
		--tw-shadow-colored: 0 0 2px 0 var(--tw-shadow-color), 0 4px 6px 0 var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
		font-size: 11pt;
	}

	.card:hover {
		background-color: #85A377;
		color: #F1E9D2;
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.card.selected {
		background-color: #5E8D5C;
		color: #F1E9D2;
	}

    /* :global(.tooltip) {
        position: relative;
        display: inline-block;
        cursor: pointer;
    }
    :global(.tooltip::before) {
        opacity: 1;
        background-color: #DBEEFB;
        color: theme('colors.primary');
    } */

	.loading {
		color: #F1E9D2;
  }
  .rendered-html :global(h1),
  .rendered-html :global(h2),
  .rendered-html :global(h3),
  .rendered-html :global(h4),
  .rendered-html :global(h5),
  .rendered-html :global(h6) {
      margin-top: 1em;
      margin-bottom: 0.5em;
      font-weight: bold;
  }

  .rendered-html :global(p) {
      margin-bottom: 1em;
  }

  .rendered-html :global(ul),
  .rendered-html :global(ol) {
      margin-bottom: 1em;
      padding-left: 2em;
  }

  .rendered-html :global(li) {
      margin-bottom: 0.5em;
  }

  .rendered-html :global(a) {
      color: #0000FF;
      text-decoration: underline;
  }
</style>
