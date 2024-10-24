import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';

const openai = new OpenAI({
  apiKey: OPEN_AI_KEY
});

export async function POST({ request }) {
  const { message } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant specializing in geospatial analysis for the Amazon region, focusing on health, climate, and deforestation. Provide concise answers, and generate a map style when required.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      functions: [
        {
          name: 'generate_map_info',
          description: 'Provides information about map visualization and recommendations for additional properties to visualize.',
          parameters: {
            type: 'object',
            properties: {
              answer: {
                type: 'string',
                description: 'The user shared the property they are visualizing on the map. Explain the significance and meaning of the property that is being visualized '
              },
              recommendation: {
                type: 'string',
                description: "The user shared with you the other properties they have access to and which one they are visualizing now. Recommend one of the other properties and explain why it would add context to the current visualization."
              }
            },
            required: ['answer', 'recommendation']
          }
        }
      ],
      function_call: { name: 'generate_map_info' }
    });

    const result = completion.choices[0].message;
    
    if (result.function_call) {
      const parsedData = JSON.parse(result.function_call.arguments);
	  console.log('Parsed answer:', parsedData.answer);
      console.log('Parsed recommendation:', parsedData.recommendation);

      return json({
        answer: parsedData.answer,
        recommendation: parsedData.recommendation
      });
    } else {
      return json({ message: 'No structured output available.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return json({ message: 'An error occurred.', error }, { status: 500 });
  }
}
