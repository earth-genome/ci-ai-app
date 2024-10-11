import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';
import { assistantDefinitions } from '$lib/assistant-definition.js';
import { citationsMap } from '$lib/citations-map.js';
import { get } from 'svelte/store';
import { promptModifiers, sliderValues } from '$lib/stores.js';

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

export async function POST({ request }) {
	const { message, agentIndex, currentSliderValues } = await request.json();

	try {
		console.log('currentSliderValues: ', currentSliderValues);
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
				} else {
					console.log('There are no citations');
				}
			}

			return json({
				message: processedText,
				citations: citations,
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
