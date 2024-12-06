import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';
import { assistantDefinitions } from '$lib/assistant-definition.js';
import { citationsMap } from '$lib/citations-map.js';

const openai = new OpenAI({
	apiKey: OPEN_AI_KEY
});

export async function POST({ request }) {
	const { message, agentIndex } = await request.json();

	try {
		// Create a temporary assistant
		const assistant = await openai.beta.assistants.create(assistantDefinitions[agentIndex]);

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
			const citations = [];

			let processedText = text.value;

			for (let i = 0; i < annotations.length; i++) {
				const annotation = annotations[i];
				processedText = processedText.replace(annotation.text, `[${i}]`);

				const { file_citation } = annotation;
				if (file_citation) {
					const citedFile = await openai.files.retrieve(file_citation.file_id);
					const filename = citedFile.filename;
					const link = citationsMap.find((map) => map.filename === filename)?.link || '#';
					citations.push(`
            	<a href="${link}" class="card-title-link">
  					<h2 class="card-title">${i} - ${filename}</h2>
				</a>
            `);
				} else {
					console.log('There are no citations');
				}
			}

			const responseWithCitations =
				processedText + (citations.length > 0 ? '\n\nCitations:\n' + citations.join('\n') : '');

			// console.log('Processed text:', processedText);
			// console.log('Citations:', citations);
			// console.log('Response with citations:', responseWithCitations);
			// console.log('Raw annotations:', annotations);

			return json({
				message: processedText,
				citations: citations,
				responseWithCitations: responseWithCitations,
				rawAnnotations: annotations // Include raw annotations for potential frontend use
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
