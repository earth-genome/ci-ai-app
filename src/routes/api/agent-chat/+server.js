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
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Retrieve the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

    // Clean up: delete the temporary assistant
    await openai.beta.assistants.del(assistant.id);

    if (assistantMessage && assistantMessage.content[0].type === 'text') {
      const { text } = assistantMessage.content[0];
      const { annotations } = text;
      const citations = [];

      let index = 0;
      for (let annotation of annotations) {
        text.value = text.value.replace(annotation.text, "[" + index + "]");
        const { file_citation } = annotation;
        if (file_citation) {
          const citedFile = await openai.files.retrieve(file_citation.file_id);
          citations.push("[" + index + "]" + citedFile.filename);
        }
        index++;
      }

      const links = citations.map((citation, index) => {
        const filename = citation.split(']')[1].trim();
        const link = citationsMap.find(map => map.filename === filename)?.link;
        return `<p><a href="${link}" target="_blank">${citation.split(']')[0]}: ${link}</a></p>`;
      });

      console.log('citations: ', citations);
      console.log('links: ', links);

      return json({ message: text.value + "\n" + links });
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
      'Content-Type': 'text/plain',
    },
  });
}
