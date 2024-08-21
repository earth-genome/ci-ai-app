import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';

const openai = new OpenAI({
  apiKey: OPEN_AI_KEY
});

export async function POST({ request }) {
  const { message } = await request.json();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
    stream: true,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(content);
        }
      }
      controller.close();
    },
  });



  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function GET() {
  return new Response('This endpoint only supports POST requests for streaming responses from OpenAI.', {
    status: 405, // Method Not Allowed
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}