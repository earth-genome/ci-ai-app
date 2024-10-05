<script>
	import { onMount, afterUpdate } from 'svelte';
	import userAvatar from '$lib/images/user-square.png';
	import robotAvatar from '$lib/images/robot-circle.png';
	import { currentCitations } from '$lib/stores';
	import { assistantDefinitions } from '$lib/assistant-definition.js';
	import { textEditorContent, codeBlocksMap } from '$lib/stores.js';
	import { get } from 'svelte/store';
	import Prism from 'prismjs';
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-python';

	let userQuestion = '';
	let assistantResponse = '';
	let input = '';
	let isLoading = false;
	let chatHistory = [];
	let chatUsed = false;
	let selectedCardIndex = 0;

	const cardTexts = [
		'⚗️👨‍🔬🔬Expert scientist:<br>A knowledgeable research assistant to help you explore scientific literature',
		'📊💻🔍Data analyst:<br>Helps you explore data, conclusions, and the significance of findings',
		'🧠💭🔬Methods analyst:<br>Helps you examine methodology, finding weak spots and suggesting further research',
		'🏫🍎📚Teacher:<br>Your favorite teacher breaks down topics. Choose from kindergarten to graduate level'
	];

	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function extractCodeBlocks(response) {
		const multiLineCodeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
		const singleLineCodeBlockRegex = /`([^`]+)`/g;
		const citationRegex = /\[(\d+)\]/g;
		let match;
		const codeBlocks = [];
		let prunedResponse = response;
		const codeMap = new Map();

		// Handle multi-line code blocks
		while ((match = multiLineCodeBlockRegex.exec(response)) !== null) {
			const codeId = `code-${codeMap.size}`;
			codeMap.set(codeId, match[2].trim());

			const escapedCode = escapeHtml(match[2].trim());
			const codeBlockHtml = `
				<div class="code-card">
					<div class="code-card-header">
						<span class="code-language">${ match[1].trim() === '' ? 'js' : match[1].trim() === 'javascript' ? 'js' : match[1].trim() }</span>
						<button class="copy-button" onclick="window.insertCode('${codeId}')">Insert code</button>
					</div>
					<pre><code class="language-${match[1].trim() === '' ? 'js' : match[1].trim() === 'javascript' ? 'js' : match[1].trim()}">${escapedCode}</code></pre>
				</div>`;
			prunedResponse = prunedResponse.replace(match[0], codeBlockHtml);
		}

		// Handle single-line code blocks
		prunedResponse = prunedResponse.replace(singleLineCodeBlockRegex, (match, p1) => {
			const escapedCode = escapeHtml(p1.trim());
			return `<code class="inline-code">${escapedCode}</code>`;
		});

		// Handle citations
		prunedResponse = prunedResponse.replace(citationRegex, (match, p1) => {
			const citationIndex = parseInt(p1, 10);
			const citation = get(currentCitations)[citationIndex];
			console.log("cit: ", citation);
            // return ``;
            return `
                <div class="tooltip" data-tip=${citation}>
                    <span class="badge badge-primary">${p1}</span>
                </div>
            `
		});

		codeBlocksMap.set(codeMap);
		return { codeBlocks, prunedResponse: prunedResponse.trim() };
	}

	function insertCode(codeId) {
		const codeMap = get(codeBlocksMap);
		const code = codeMap.get(codeId);
		textEditorContent.update((content) => {
			const newContent = content + '\n' + code;
			return newContent;
		});
	}

	function handleCardClick(index) {
		selectedCardIndex = index;
	}

	async function sendMessage() {
		if (input.trim() === '') return;

		chatUsed = true;
		const userMessage = input;
		input = '';
		isLoading = true;

		chatHistory.push({ role: 'user', content: userMessage });
		const assistantMessageIndex = chatHistory.length;
		chatHistory.push({ role: 'assistant', content: 'Loading...' });

		try {
            console.log(selectedCardIndex)
			const response = await fetch('../api/multiagent-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: userMessage,
					agentIndex: selectedCardIndex
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
//             const data = {
//                 "message": "<h1>Interesting Finding on Sustainable Development in the Amazon</h1>\n\n<h2>Novel Sustainable Development Paradigm</h2>\n😊 The Amazon region has been facing significant environmental challenges due to land-use changes and climate change. A study highlights the need for a new sustainable development paradigm. The Amazon region’s development has traditionally relied on intensive exploitation of natural resources, leading to extensive deforestation and biodiversity loss. This has created high risks of irreversible changes in the tropical forests. Notably, modeling studies have identified two critical tipping points: a temperature increase of 4°C or deforestation exceeding 40% of the forest area, beyond which large-scale savannization could occur.\n\n<h2>Integrating Advanced Technologies</h2>\n🚀 An interesting proposal for a novel sustainable development paradigm involves leveraging advanced digital, biological, and material technologies. This approach aims to create high-value products and services using the Amazon’s biological assets. This paradigm shift from traditional agricultural and hydropower exploitation to a high-tech innovation approach could help conserve the Amazon as a global public good while fostering sustainable economic development[0].\n\n<h2>Health Care and Conservation in Borneo</h2>\n😊 Another fascinating insight comes from an intervention in rural Borneo that combined health care improvements with conservation efforts. By expanding health care access to communities living near a national park and providing clinic discounts, the intervention significantly reduced illegal logging activities. Over a decade, this approach led to a 70% reduction in deforestation in the national park area. It also provided health care access to over 28,400 unique patients, highlighting a successful human-centered solution to achieving natural climate mitigation and improving community well-being simultaneously[1][2].\n\nThese examples underscore the importance of innovative and integrated approaches to sustainable development and conservation efforts in biodiverse and ecologically crucial regions of the world.",
//                 "citations": {
//                     "0": "nobre-et-al-2016-land-use-and-climate-change-risks-in-the-amazon-and-the-need-of-a-novel-sustainable-development.pdf",
//                     "1": "jones-et-al-2020-improving-rural-health-care-reduces-illegal-logging-and-conserves-carbon-in-a-tropical-forest.pdf",
//                     "2": "jones-et-al-2020-improving-rural-health-care-reduces-illegal-logging-and-conserves-carbon-in-a-tropical-forest.pdf"
//                 }
// }
            console.log(data)
			const { codeBlocks, prunedResponse } = extractCodeBlocks(data.message);
			const assistantResponse = prunedResponse;
			currentCitations.set(data.citations);

			// update the last assistant message with the actual response
			chatHistory[assistantMessageIndex] = { role: 'assistant', content: assistantResponse };
		} catch (error) {
			console.error('Error:', error);
			// update the last assistant message to indicate an error
			chatHistory[assistantMessageIndex] = {
				role: 'assistant',
				content: 'Sorry, an error occurred.'
			};
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		Prism.highlightAll();
		window.insertCode = insertCode;
	});

	afterUpdate(() => {
		Prism.highlightAll();
	});
</script>


<div class="chat-container">
	<div class="cards-container {chatUsed ? 'cards-top' : 'cards-center'}">
		{#each cardTexts as text, index}
			<button
				class="card {index === selectedCardIndex ? 'selected' : ''}"
				on:click={() => handleCardClick(index)}
				on:keydown={(e) => e.key === 'Enter' && handleCardClick(index)}
			>
				{@html text}
			</button>
		{/each}
	</div>
	<div class="messages">
		{#each chatHistory as message}
			<div class={message.role === 'user' ? 'user-question' : 'assistant-response'}>
				{#if message.role === 'assistant'}
					<img src={robotAvatar} alt="{message.role} icon" class="avatar" />
				{/if}
				<div class="message-content {message.role}">
					{#if message.role === 'assistant' && message.content === 'Loading...'}
						<span
							class="loading-icon"
							class:loading={isLoading}
							class:loading-bars={isLoading}
							class:loading-lg={isLoading}
						/>
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
					placeholder="Message..."
					class="input-box"
					bind:value={input}
					on:keydown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
				/>
				<button class="send-button" on:click={sendMessage} disabled={isLoading}>
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="icon-2xl"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
							fill="currentColor"
						/>
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

	.message-content {
		background-color: #f4f4f4; /* Light gray background */
		padding: 10px 20px;
		border-radius: 20px; /* Rounded corners */
		max-width: 70%; /* Limit the width of the message content */
		word-wrap: break-word; /* Ensure long words break to the next line */
	}

	.loading-icon {
		color: gray;
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
		z-index: 2; /* Ensure it sits above the chat container */
	}

	.card {
		background-color: #fff; /* White background */
		color: #676767; /* Dark text color for contrast */
		padding: 15px; /* Slightly smaller padding */
		border-radius: 15px; /* More rounded corners */
		text-align: center;
		flex: 1; /* Make the cards responsive */
		max-width: 180px; /* Slightly smaller default size */
		max-height: 140px; /* Ensure the cards are square */
		aspect-ratio: 1 / 1; /* Maintain a consistent aspect ratio */
		cursor: pointer;
		transition: background-color 0.3s, box-shadow 0.3s;
		margin: 0 10px; /* Add some margin between cards */
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #e0e0e0; /* Border color */
		--tw-shadow: 0 0 2px 0 rgba(0, 0, 0, .05), 0 4px 6px 0 rgba(0, 0, 0, .02);
		--tw-shadow-colored: 0 0 2px 0 var(--tw-shadow-color), 0 4px 6px 0 var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
		font-size: 9pt; /* Set text size to 10pt */
	}

	.card:hover {
		background-color: #f0f0f0; /* Slightly darker background on hover */
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Slightly larger shadow on hover */
	}

	.card.selected {
		background-color: #e0f7fa; /* Pale blue background for selected card */
		border: 1px solid #00acc1; /* Border color for selected card */
	}
</style>