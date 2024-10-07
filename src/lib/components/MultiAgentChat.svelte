<script>
	import { onMount, afterUpdate } from 'svelte';
	import userAvatar from '$lib/images/user-square.png';
	import robotAvatar from '$lib/images/robot-circle.png';
	import { currentCitations } from '$lib/stores';
    import { pdf_citation_mapping } from '$lib/pdf_citation_mapping.js';
	import { assistantDefinitions } from '$lib/assistant-definition.js';
	import { textEditorContent, codeBlocksMap, sliderValues } from '$lib/stores.js';
	import { get } from 'svelte/store';

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
        // match: full matched strig "[0]", p1: first captured group "0"
		prunedResponse = prunedResponse.replace(citationRegex, (match, p1) => {
			const citationIndex = parseInt(p1, 10);
			let citation = get(currentCitations)[citationIndex]
            console.log('currentCitations: ', get(currentCitations));
            console.log('citationIndex: ', citationIndex);
            console.log('citation: ', citation);
            citation = pdf_citation_mapping[citation] || citation

            return `
                <div class="tooltip" data-tip="${citation}">
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
					agentIndex: selectedCardIndex,
                    currentSliderValues: get(sliderValues)
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
            // const data = //intersting undefined citation error
//             {
//     "message": "<h1>About Your Papers</h1>\n\n🌱 <i>Your papers encompass a variety of research topics related to forestry, hydrology, and environmental science.</i> One notable paper titled **\"Forests as ‘sponges’ and ‘pumps’: Assessing the impact of deforestation on dry-season flows across the tropics\"** investigates the effect of deforestation on water flows in tropical regions, authored by Jorge L. Peña-Arancibia et al. This research emphasizes the dual roles of forests in regulating water supply and highlights that deforestation can significantly disrupt these processes.\n\n<h2>Key Findings</h2>\n\n📝 <b>Impact of Deforestation</b>: The study found that in about **80%** of analyzed cases, forest restoration and cover expansion negatively impacted water yield, contrary to the expected positive outcomes often assumed in forest management discussions[0]. \n\n📊 <b>Methodology</b>: The researchers performed a systematic literature review, identifying a total of **666** papers, with **482** deemed relevant to the study's focus. They categorized data based on geographic location, intervention type, and hydrological responses, ultimately synthesizing findings from **167** papers for analysis[1].\n\n<h2>Additional Papers and Contributions</h2>\n\n🌳 Other related studies illustrate the broader implications of forest management practices on environmental outcomes, emphasizing topics such as carbon conservation and the socio-economic factors influencing deforestation rates[2][3]. These papers collectively suggest that more rigorous methodologies and interdisciplinary approaches are essential for addressing the complex interactions between forestry practices and ecosystem health.\n\n🔗 You can further explore the findings in detail through the <a href=\"https://doi.org/10.1016/j.jhydrol.2019.04.064\">Journal of Hydrology</a> where this research is published.",
//     "citations": {
//         "0": "Pena_Arancibia_2019_JH_pantropicalflowimpactsofdeforestation.pdf",
//         "1": "file.pdf",
//         "2": "jones-et-al-2020-improving-rural-health-care-reduces-illegal-logging-and-conserves-carbon-in-a-tropical-forest.pdf",
//         "3": "jones-et-al-2020-improving-rural-health-care-reduces-illegal-logging-and-conserves-carbon-in-a-tropical-forest.pdf"
//     }
// }
    //         const data = {
    // "message": "<h1>Interesting Findings in Recent Research Papers</h1>\n\n<h2>🌳 Forest Management and Climate Change</h2>\n\n<p>🌿 <b>Climber Removal in Tropical Forests:</b> An intriguing study shows that <i>climber removal</i> in tropical forests can more than double tree growth and roughly triple biomass accumulation (AGB). This has significant implications for global carbon sequestration, as removing climbers can potentially sequester 32 Gigatons of CO2 over a decade if applied to secondary and production forests across the tropics[0].</p>\n\n<h2>🚑 Health Interventions and Environmental Conservation</h2>\n\n<p>🌲 <b>Linking Healthcare and Forest Conservation in Indonesia:</b> A fascinating intervention combined improved healthcare access with conservation programs in rural Indonesian communities near a national park. This multi-sector approach resulted in reduced illegal logging and better health outcomes. Forest loss rates declined significantly in areas with high engagement in the intervention programs. By 2012, over 97% of households believed the intervention effectively reduced illegal logging[1][2][3].</p>\n\n<h2>🌍 Agroforestry and Climate Benefits</h2>\n\n<p>🌾 <b>Cooling Effects of Silvopasture:</b> Research indicates that integrating trees into pasturelands (silvopasture) can significantly cool local environments. This practice has the potential to store substantial carbon in regions like Africa and the Americas, thus contributing to climate change mitigation. Not only does this reduce heat exposure for outdoor workers and livestock, but it also aligns with sustainable development and biodiversity conservation goals[4][5].</p>\n\n<h2>🍃 Deforestation and Temperature Increase</h2>\n\n<p>🔥 <b>Impact of Forest Change on Temperature:</b> A global analysis showed that deforestation causes significant warming, while reforestation can provide cooling effects. For instance, deforestation in tropical regions increased local surface temperature by approximately 0.38°C, whereas similar levels of forestation led to a temperature decrease of 0.18°C. This highlights the importance of forest management in mitigating local climate changes[6].</p>\n\nMake sure to delve deeper into these studies if they pique your interest as they provide comprehensive methods, results, and discussions on these impactful topics!",
    // "citations": {
    //     "0": "Ecology and Evolution - 2022 - Finlayson - Removing climbers more than doubles tree growth and biomass in degraded tropical.pdf",
    //     "1": "jones-et-al-2020-improving-rural-health-care-reduces-illegal-logging-and-conserves-carbon-in-a-tropical-forest.pdf",
    //     "2": "jones-et-al-2020-improving-rural-health-care-reduces-illegal-logging-and-conserves-carbon-in-a-tropical-forest.pdf",
    //     "3": "jones-et-al-2020-improving-rural-health-care-reduces-illegal-logging-and-conserves-carbon-in-a-tropical-forest.pdf",
    //     "4": "s41467-022-28388-4.pdf",
    //     "5": "s41467-022-28388-4.pdf",
    //     "6": "file (4).pdf"
    // }
// }
            console.log(data)
			currentCitations.set(data.citations);
			const { codeBlocks, prunedResponse } = extractCodeBlocks(data.message);
			const assistantResponse = prunedResponse;

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
		window.insertCode = insertCode;
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
	<div class="messages ">
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
		background-color: #000000;
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
		background-color: #000000;
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
		border: 1px solid oklch(var(--s));
		margin-right: 5px;
		background-color: oklch(var(--s));
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
		background-color: #000000; /* Light gray background */
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
		z-index: 2; /* Ensure it sits above the chat container */
	}

	.card {
		background-color: oklch(var(--s)); /* White background */
		color: oklch(var(--pc)); /* Dark text color for contrast */
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
		background-color: #111111; /* Slightly darker background on hover */
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Slightly larger shadow on hover */
	}

	.card.selected {

		background-color: #000000; /* Pale blue background for selected card */
		border: 1px solid #003e24; /* Border color for selected card */
	}

    /* :global(.tooltip) {
        position: relative;
        display: inline-block;
    }

    :global(.tooltip::before) {
        content: attr(data-tip);
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.3s;
        
        left: 50%;
        transform: translateX(-50%);
        bottom: 125%;
    }

    :global(.tooltip:hover::before) {
        opacity: 1;
    }

    :global(.tooltip:hover::before) {
        left: 50%;
        transform: translateX(-50%);
    }

    :global(.tooltip:hover::before) {
        left: auto;
        right: 0;
        transform: none;
    }

    :global(.tooltip:hover::before) {
        left: 0;
        right: auto;
        transform: none;
    } */
</style>