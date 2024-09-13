import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';
import { assistantDefinitions } from '$lib/assistant-definition.js';
import { citationsMap } from '$lib/citations-map.js';
import fs from "fs";

const openai = new OpenAI({
	apiKey: OPEN_AI_KEY
});

let thread;

(async () => {	
    thread = await openai.beta.threads.create();
})();

export async function POST({ request }) {
	const { message, agentIndex } = await request.json();

	try {
		// Create a temporary assistant\
        const assistant = await openai.beta.assistants.create(assistantDefinitions[agentIndex]);
        // const assistant = await openai.beta.assistants.retrieve("asst_gaXDLcc9Ay1mCOnkRKnQmSGe")

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

        console.log('assistantMessage: ', assistantMessage);

		// Clean up: delete the temporary assistant
		await openai.beta.assistants.del(assistant.id);

		if (assistantMessage) {
			const textMessage = assistantMessage.content.find(msg => msg.type === 'text');
			const imageMessage = assistantMessage.content.find(msg => msg.type === 'image_file');

            console.log('imageMessage: ', imageMessage);

			if (imageMessage) {
				let imageFileID = imageMessage.image_file.file_id
				const response = await openai.files.content(imageFileID);
                console.log('rsponse: ', response);
				const image_data = await response.arrayBuffer();
				const image_data_buffer = Buffer.from(image_data);
				fs.writeFileSync("src/lib/images/temp-chart.png", image_data_buffer);
			}

			if (textMessage) {
				const { text } = textMessage;
				const { annotations } = text;
				const citations = [];

                console.log('text: ', text);

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

				console.log('Processed text:', processedText);
				console.log('Citations:', citations);

				return json({
					message: processedText,
					citations: citations,
					responseWithCitations: responseWithCitations,
					rawAnnotations: annotations // Include raw annotations for potential frontend use
				});
			}

			// If no response from the assistant, handle it here
			if (!textMessage && !imageMessage) {
				return json({ message: 'No response from the assistant.' });
			}
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
