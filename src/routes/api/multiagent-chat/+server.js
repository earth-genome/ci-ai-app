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

function getPromptModifierString(vals) {
    let modifierString = '';
    const promptModifiersValue = get(promptModifiers);
    
    for (const [key, value] of Object.entries(vals)) {
        if (promptModifiersValue[key] && promptModifiersValue[key][value]) {
            if (key === 'grade') {
                modifierString += `Respond as if you are speaking with a student of ${promptModifiersValue[key][value]} grade level. `;
            } else {
                const attribute = key.charAt(0).toUpperCase() + key.slice(1);
                modifierString += `Your ${attribute.toLowerCase()} should be described by these keywords: ${promptModifiersValue[key][value]}. `;
            }
        }
    }
    
    return modifierString.trim();
}

export async function POST({ request }) {
	const { message, agentIndex, currentSliderValues } = await request.json();

	try {
        console.log('currentSliderValues: ', currentSliderValues);
        const modifierString = getPromptModifierString(currentSliderValues);
        const assistantDef = { ...assistantDefinitions[agentIndex] };

        assistantDef.instructions = assistantDef.instructions + ' ' + modifierString;
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
