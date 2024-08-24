<script>
	import { onMount } from 'svelte';
	import userAvatar from '$lib/images/user-square.png';
	import robotAvatar from '$lib/images/robot-circle.png';
	import { selectedOption } from '$lib/stores';
	let messages = [];
	let input = '';
	let isLoading = false;

	async function sendMessage() {
		if (input.trim() === '') return;

		const currentInput = input;
		input = '';

		messages = [
			...messages, 
			{ role: 'user', content: currentInput },
			{ role: 'assistant', content: 'Loading...', isLoading: true }
		];
		isLoading = true;

		try {
			const response = await fetch('../api/agent-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					message: currentInput,
					agentIndex: $selectedOption
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			messages = messages.filter(msg => !msg.isLoading);
			messages = [...messages, { role: 'assistant', content: data.message }];
		} catch (error) {
			console.error('Error:', error);
			messages = messages.filter(msg => !msg.isLoading);
			messages = [...messages, { role: 'assistant', content: 'Sorry, an error occurred.' }];
		} finally {
			isLoading = false;
		}

		console.log('messages: ', messages);
	}
</script>

<div class="chat-container">
	<div class="messages">
		{#each messages as { role, content, isLoading }}
			<div class={`message-container ${role}`}>
				{#if role === 'assistant'}
					<img src={robotAvatar} alt="Assistant icon" class="avatar" />
				{/if}
				<div class="message-content" class:loading={isLoading}>
					{@html content}
				</div>
				{#if role === 'user'}
					<img src={userAvatar} alt="User icon" class="avatar" />
				{/if}
			</div>
		{/each}
	</div>
	<div class="input-container">
		<input
			class="input input-bordered w-full max-w-full"
			type="text"
			bind:value={input}
			placeholder="Ask me anything..."
			on:keydown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
		/>
		<button class="btn btn-primary" on:click={sendMessage} disabled={isLoading}>Send</button>
	</div>
</div>


<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.messages {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
    color: oklch(var(--pc));
	}
	.message-container {
		display: flex;
		align-items: flex-start;
		margin-bottom: 1rem;
	}
	.message-container.user {
		flex-direction: row-reverse;
	}
	.message-content {
		max-width: 70%;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		background-color: oklch(var(--nc));
	}
	.user .message-content {
		background-color: oklch(var(--s));
		text-align: right;
	}
	.input-container {
		display: flex;
		padding: 1rem;
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
	.avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		margin: 0 0.5rem;
	}
	.message-content.loading {
		font-style: italic;
		opacity: 0.7;
	}
</style>