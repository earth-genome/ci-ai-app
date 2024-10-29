import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';
import { assistantDefinitions } from '$lib/assistant-definition.js';
import { citationsMap } from '$lib/citations-map.js';
import { get } from 'svelte/store';
import { promptModifiers, sliderValues, currentCitations } from '$lib/stores.js';
import { pdf_citation_mapping } from '$lib/pdf_citation_mapping.js';

const openai = new OpenAI({
	apiKey: OPEN_AI_KEY
});

function getPromptMods(vals, agentIndex) {
	let modifierString = '';
	const promptModifiersValue = get(promptModifiers);

	for (const [key, value] of Object.entries(vals)) {
		console.log('key: ', key);
		console.log('val: ', value);
		if (promptModifiersValue[key] && promptModifiersValue[key][value]) {
			if (key !== 'temperature') {
				if (key === 'grade' && agentIndex !== 3) {
					// Skip grade level modifier if not professor agent
					continue;
				}
				modifierString += promptModifiersValue[key][value] + ' ';
			}
		}
	}

	console.log('modifierString: ', modifierString);

	return {
		'modifierString': modifierString.trim(),
		'temperature': vals['temperature']
	};
}

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
	const boldRegex = /\*\*(.*?)\*\*/g;
	let match;
	let prunedResponse = response;
	let codeBlockCount = 0;

	// Handle multi-line code blocks
	while ((match = multiLineCodeBlockRegex.exec(response)) !== null) {
		const codeId = `code-${codeBlockCount++}`;
		const language = match[1].trim() === '' ? 'js' : match[1].trim() === 'javascript' ? 'js' : match[1].trim();
		const escapedCode = escapeHtml(match[2].trim());
		const codeBlockHtml = `
			<div class="code-card">
				<div class="code-card-header">
					<span class="code-language">${language}</span>
					<button class="copy-button" onclick="window.insertCode('${codeId}')">Insert code</button>
				</div>
				<pre><code class="language-${language}">${escapedCode}</code></pre>
			</div>`;
		prunedResponse = prunedResponse.replace(match[0], codeBlockHtml);
	}

	// Handle single-line code blocks
	prunedResponse = prunedResponse.replace(singleLineCodeBlockRegex, (match, p1) => {
		const escapedCode = escapeHtml(p1.trim());
		return `<code class="inline-code">${escapedCode}</code>`;
	});

    // prunedResponse = prunedResponse.replace(citationRegex, (match, p1) => {
    // })

    function extractDOI(citation) {
        const doiRegex = /\b(10\.\d{4,}(?:\.\d+)*\/\S+)\b/;
        const match = citation.match(doiRegex);
        return match ? `https://doi.org/${match[1]}` : null;
    }
    prunedResponse = prunedResponse.replace(citationRegex, (match, p1) => {
        const citationIndex = parseInt(p1, 10);
        let citation = get(currentCitations)[citationIndex]
        console.log('currentCitations: ', get(currentCitations));
        console.log('citationIndex: ', citationIndex);
        console.log('citation: ', citation);
        citation = pdf_citation_mapping[citation] || citation

        const doiUrl = extractDOI(citation);
        const openDoiFunc = `onclick="window.open('${doiUrl}', '_blank')"` || '';

        return `
            <div class="tooltip tooltip-right" data-tip="${citation}" ${openDoiFunc}>
                <span class="badge badge-info">${p1}</span>
            </div>
        `
    });

	prunedResponse = prunedResponse.replace(boldRegex, '<b>$1</b>');

	return prunedResponse;
}

export async function POST({ request }) {
	const { message, agentIndex, currentSliderValues } = await request.json();

	try {
		console.log('assistantDefinitions[agentIndex]: ', assistantDefinitions[agentIndex]);
		const promptMods = getPromptMods(currentSliderValues, agentIndex);
		const assistantDef = { ...assistantDefinitions[agentIndex], 'temperature': promptMods.temperature};
		

		assistantDef.instructions = assistantDef.instructions + ' ' + promptMods.modifierString;
		console.log('assistantDef: ', assistantDef);
		const assistant = await openai.beta.assistants.create(assistantDef);
		// Create a new thread
		const thread = await openai.beta.threads.create();

		// Add a message to the thread
		await openai.beta.threads.messages.create(thread.id, {
			role: 'user',
			content: message
		});

		// Run the assistant
		const run = await openai.beta.threads.runs.create(thread.id, {
			assistant_id: assistant.id
		});

		// Wait for the run to complete
		let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
		while (runStatus.status !== 'completed') {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
		}

		// Retrieve the assistant's response
		const messages = await openai.beta.threads.messages.list(thread.id);
		const assistantMessage = messages.data.find((msg) => msg.role === 'assistant');

		// Clean up: delete the temporary assistant
		await openai.beta.assistants.del(assistant.id);

		if (assistantMessage && assistantMessage.content[0].type === 'text') {
			const { text } = assistantMessage.content[0];
			const { annotations } = text;
			const citations = {};

			let processedText = text.value;

			for (let i = 0; i < annotations.length; i++) {
				const annotation = annotations[i];
				processedText = processedText.replace(annotation.text, `[${i}]`);

				const { file_citation } = annotation;
				if (file_citation) {
					const citedFile = await openai.files.retrieve(file_citation.file_id);
					const filename = citedFile.filename;
					citations[i] = filename;
				}
			}

            currentCitations.set(citations);
			const prunedResponse = extractCodeBlocks(processedText);

			return json({
				message: prunedResponse,
				citations: citations
			});
		} else {
			return json({ message: 'No response from the assistant.' });
		}
	} catch (error) {
		console.error('Error:', error);
		return json({ message: 'Sorry, an error occurred.' }, { status: 500 });
	}
}

export async function GET() {
	return new Response('This endpoint only supports POST requests for responses from OpenAI.', {
		status: 405, // Method Not Allowed
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}

//upload a file to the vector store
// if vector store is past x number of files dont allow? allow for a delete?
    // - is this automatic when size limit is reached, and does larger vector store size affect performance?

