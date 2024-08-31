<script>
	import { onMount } from 'svelte';
	import userAvatar from '$lib/images/user-square.png';
	import robotAvatar from '$lib/images/robot-circle.png';
	import leafTexture from '$lib/images/leaf-texture.png';
	import { currentCitations } from '$lib/stores';
	import { assistantDefinitions } from '$lib/assistant-definition.js';

	let userQuestion = '';
	let assistantResponse = '';
	let input = '';
	let isLoading = false;
	let imageExists = false;
	let imageSrc = 'src/lib/images/temp-chart.png';
	let cacheBuster = 0; // used to force reload when temp-chart.png changes
	let chatHistory = [];

	async function checkImageExists() {
		try {
			const response = await fetch(`${imageSrc}?v=${cacheBuster}`);
			if (response.ok) {
				imageExists = true;
			}
		} catch (error) {
			imageExists = false;
		}
	}

	onMount(() => {
		checkImageExists();
	});

	async function sendMessage() {
		if (input.trim() === '') return;

		const userMessage = input;
		input = '';
		isLoading = true;

		chatHistory.push({ role: 'user', content: userMessage });
		chatHistory.push({ role: 'assistant', content: 'Loading...' });

		try {
			const response = await fetch('../api/vis-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: userMessage,
					agentIndex: 4
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			const assistantResponse = data.message;
			currentCitations.set(data.citations);
			imageSrc = 'src/lib/images/temp-chart.png';
            // TODO: could generate unique files to save history of 
            // image responses, keep inline w chat

			// update the last assistant message with the actual response
			chatHistory[chatHistory.length - 1] = { role: 'assistant', content: assistantResponse };
		} catch (error) {
			console.error('Error:', error);
			// update the last assistant message to indicate an error
			chatHistory[chatHistory.length - 1] = { role: 'assistant', content: 'Sorry, an error occurred.' };
		} finally {
			isLoading = false;
			cacheBuster = Date.now();
            await checkImageExists();
		}
	}
</script>

<div class="chat-container prose">
	<div class="input-container">
		<input
			class="input input-bordered w-full max-w-full"
			type="text"
			bind:value={input}
			placeholder="Ask me about climate change in the Amazon..."
			on:keydown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
		/>
		<button class="btn btn-primary" on:click={sendMessage} disabled={isLoading}>Send</button>
	</div>

	{#each chatHistory as message}
		<div class={message.role === 'user' ? 'user-question' : 'assistant-response'}>
			<img src={message.role === 'user' ? userAvatar : robotAvatar} alt="{message.role} icon" class="avatar" />
			<div class="content {message.role}">
				{#if message.role === 'assistant' && isLoading}
					<span
                        class="loading-icon"
                        class:loading={isLoading}
                        class:loading-bars={isLoading}
                        class:loading-lg={isLoading}
                    ></span>
				{:else}
					{@html message.content}
				{/if}
			</div>
		</div>
	{/each}
</div>

<div class="image-row">
    {#if imageExists}
        <img
            src={`${imageSrc}?v=${cacheBuster}`}
            alt="Visualization of the user's query response"
            class="image"
        />
    {/if}
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		width: 100vw;
	}
	.input-container {
		flex-grow: 1;
	}
	.user-question,
	.assistant-response {
		display: flex;
		align-items: center;
	}
	.avatar {
		width: 40px;
		height: 40px;
		margin-right: 10px;
	}
	.image-row {
		width: 100%;
		background-color: #f0f0f0;
		padding: 1rem;
	}
	.image {
		width: 100%;
	}
	.loading-icon {
		color: gray;
	}
</style>
