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

	async function sendMessage() {
		if (input.trim() === '') return;

		userQuestion = input;
		input = '';
		assistantResponse = '';
		isLoading = true;

		try {
			const response = await fetch('../api/vis-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: userQuestion,
					agentIndex: 4
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			assistantResponse = data.message;
			currentCitations.set(data.citations);
			console.log("this is the store", currentCitations);
		} catch (error) {
			console.error('Error:', error);
			assistantResponse = 'Sorry, an error occurred.';
		} finally {
			isLoading = false;
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

	{#if userQuestion}
		<div class="user-question">
			<img src={userAvatar} alt="User icon" class="avatar" />
			<div class="content user">{userQuestion}</div>
		</div>
	{/if}

	<div class="assistant-response">
		{#if isLoading || assistantResponse}
			<img src={robotAvatar} alt="Assistant icon" class="avatar" />
			<div
				class="content assistant"
				class:loading={isLoading}
				class:loading-bars={isLoading}
				class:loading-lg={isLoading}
			>
				{@html assistantResponse}
			</div>
		{/if}
	</div>
</div>

<div class="image-row">
	<!-- <img src={leafTexture} alt="Returnred visualization" class="image" /> -->
	<!-- {#if fileExists} -->
    <img src=src/lib/images/temp-chart.png alt="Returnred visualization" class="image" />
	<!-- {/if} -->
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
	.user-question, .assistant-response {
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
</style>
