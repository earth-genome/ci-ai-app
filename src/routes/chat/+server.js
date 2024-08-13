import { OPEN_AI_KEY } from '$env/static/private';
export const POST = async ({ request }) => {
  const { message } = await request.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPEN_AI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      stream: true
    })
  });

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    }
  });
};
