<script>
	import { onMount } from 'svelte';
	import userAvatar from '$lib/images/user-square.png';
	import robotAvatar from '$lib/images/robot-circle.png';
	import { currentCitations } from '$lib/stores';
	import { pointInfo } from '$lib/stores';
	import { assistantDefinitions } from '$lib/assistant-definition.js';
	import { EventStream } from 'openai/lib/EventStream';

	let assistantResponse = '';
	let isLoading = false;
	let userQue;

	async function sendMessage(input) {
		assistantResponse = '';
		isLoading = true;

		try {
			const response = await fetch('../api/agent-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: JSON.stringify(input),
					agentIndex: 1
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			assistantResponse = data.message;
			currentCitations.set(data.citations);
			console.log('this is the store', currentCitations);
		} catch (error) {
			console.error('Error:', error);
			assistantResponse = 'Sorry, an error occurred.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div>
	
	{#if assistantResponse}
		<div class="card bg-base-100 w-100 shadow-xl overflow-y-auto bg-neutral-content max-h-[500px]">
			<div class="card-body prose">
				{@html assistantResponse}
			</div>
		</div>
        {:else}
            <button class="btn btn-lg bg-primary" on:click={sendMessage($pointInfo)}>Tell me More</button>
	{/if}
        
    
</div>

<style>
</style>
