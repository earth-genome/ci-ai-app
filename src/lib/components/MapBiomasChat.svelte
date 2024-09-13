<script>
	import { onMount } from 'svelte';
	import userAvatar from '$lib/images/user-square.png';
	import robotAvatar from '$lib/images/robot-circle.png';
	import { currentCitations } from '$lib/stores';
	import { assistantDefinitions } from '$lib/assistant-definition.js';
    import { textEditorContent } from '$lib/stores.js';

	let userQuestion = '';
	let assistantResponse = '';
	let input = '';
	let isLoading = false;
	let chatHistory = [];

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function extractCodeBlocks(response) {
        const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
        let match;
        const codeBlocks = [];
        let prunedResponse = response;

        while ((match = codeBlockRegex.exec(response)) !== null) {
            codeBlocks.push({
                language: match[1].trim(),
                code: match[2].trim()
            });

            // Escape HTML characters in the code block
            const escapedCode = escapeHtml(match[2].trim());
            // Replace the matched code block with an HTML <pre><code class="code-card"> element
            const codeBlockHtml = `<pre class="code-card"><code>${escapedCode}</code></pre>`;
            prunedResponse = prunedResponse.replace(match[0], codeBlockHtml);
        }

        return { codeBlocks, prunedResponse: prunedResponse.trim() };
    }

	async function sendMessage() {
		if (input.trim() === '') return;

		const userMessage = input;
		input = '';
		isLoading = true;

		chatHistory.push({ role: 'user', content: userMessage });
		const assistantMessageIndex = chatHistory.length;
		chatHistory.push({ role: 'assistant', content: 'Loading...' });

		try {
			const response = await fetch('../api/mapbiomas-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: userMessage +  "\n\nCode context:\n```" + $textEditorContent + "```",
					agentIndex: 5
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
            const { codeBlocks, prunedResponse } = extractCodeBlocks(data.message);
            console.log(codeBlocks);
			const assistantResponse = prunedResponse
            // const assistantResponse = data.message;
			// currentCitations.set(data.citations);

			// update the last assistant message with the actual response
			chatHistory[assistantMessageIndex] = { role: 'assistant', content: assistantResponse };
            console.log('chatHistory: ', chatHistory);
		} catch (error) {
			console.error('Error:', error);
			// update the last assistant message to indicate an error
			chatHistory[assistantMessageIndex] = { role: 'assistant', content: 'Sorry, an error occurred.' };
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- <code class=""><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'Hello, World!'</span>); -->

<div class="chat-container">
	<div class="messages"> 
		{#each chatHistory as message}
			<div class={message.role === 'user' ? 'user-question' : 'assistant-response'}>
				{#if message.role === 'assistant'}
					<img src={robotAvatar} alt="{message.role} icon" class="avatar" />
				{/if}
				<div class="content {message.role}">
					{#if message.role === 'assistant' && message.content === 'Loading...'}
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
				{#if message.role === 'user'}
					<img src={userAvatar} alt="{message.role} icon" class="avatar" />
				{/if}
			</div>
		{/each}
        <div class="input-container">        
            <div class="input-wrapper">
                <input
                    type="text"
                    placeholder="I'd like to map..."
                    class="input-box"
                    bind:value={input}
                    on:keydown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                />
                <button
                    class="send-button"
                    on:click={sendMessage}
                    disabled={isLoading}
                >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-2xl">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path>
                    </svg>
                </button>
            </div>
        </div>
	</div>
</div>

<style lang="postcss">
	.chat-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 80vh;
		position: relative;
	}

	.messages {
		flex-grow: 1;
		overflow-y: auto;
		border-radius: 15px;
		background-color: #ffffff;
		padding: 10px;
		padding-bottom: 60px;
	}

	.input-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		position: absolute;
		bottom: 0;
		width: 98%;
		background-color: #ffffff;
		overflow: hidden;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.input-box {
		flex: 1;
		padding: 10px;
		border-radius: 20px;
		border: 1px solid #f4f4f4;
		margin-right: 5px;
		background-color: rgb(235, 235, 235);
	}

	.send-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background-color: transparent;
		cursor: pointer;
		border: 10 solid #000000;
		box-sizing: border-box;
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
	}

	.loading-icon {
		color: gray;
	}

	.code-card {
		background-color: #2d2d2d;
		border-radius: 5px;
		padding: 10px;
		margin-top: 10px;
		overflow-x: auto;
	}

	:global(.code-card) {
		background-color: #2d2d2d;
		border-radius: 5px;
		padding: 10px;
		margin-top: 10px;
		overflow-x: auto;
	}

	:global(.code-card code) {
		color: #b1b13f;
		font-family: 'Courier New', Courier, monospace;
		white-space: pre-wrap;
	}
</style>
