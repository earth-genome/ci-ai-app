<script>
	import { onMount } from 'svelte';
	import userAvatar from '$lib/images/user-square.png';
	import robotAvatar from '$lib/images/robot-circle.png';
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
			const response = await fetch('../api/agent-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: userQuestion,
					agentIndex: 0
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			assistantResponse = data.message;
			currentCitations.set(data.citations);
			// console.log("this is the store", currentCitations);
            // console.log('assistantResponse: ', assistantResponse);
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

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.input-container {
		display: flex;
		padding: 1rem;
		position: sticky;
		top: 0;
		background-color: oklch(var(--b1));
		z-index: 10;
	}
	input {
		flex-grow: 1;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button {
		margin-left: 1rem;
		padding: 0.5rem 1rem;
	}
	.user-question,
	.assistant-response {
		display: flex;
		align-items: flex-start;
		margin: 1rem;
	}
	.user-question {
		flex-direction: row-reverse;
	}
	.content {
		/* max-width: 70%; */
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		background-color: oklch(var(--nc));
	}
	.user {
		background-color: oklch(var(--p));
		text-align: right;
	}
	.avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		margin: 0 0.5rem;
	}
	.loading {
		background-color: oklch(var(--p));
	}
</style>
