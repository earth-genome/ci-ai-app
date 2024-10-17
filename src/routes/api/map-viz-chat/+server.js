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
          name: 'generate_map_style',
          description: 'Generates a map style and provides a related answer.',
          parameters: {
            type: 'object',
            properties: {
              answer: {
                type: 'string',
                description: 'The answer to the user\'s question about health, climate, and deforestation in the Amazon.'
              },
              mapStyle: {
                type: 'string',
                description: "This should return a mapbox polygon paint property specifying the fill color for a map style. the map style should be related to the user's question. for instance paint: {'fill-color':'#ff0000'}"
              }
            },
            required: ['answer', 'mapStyle']
          }
        }
      ],
      function_call: { name: 'generate_map_style' }
    });

    const result = completion.choices[0].message;
    
    if (result.function_call) {
      const parsedData = JSON.parse(result.function_call.arguments);
	  console.log('Parsed answer:', parsedData.answer);
      console.log('Parsed mapStyle:', parsedData.mapStyle);

      return json({
        answer: parsedData.answer,
        mapStyle: parsedData.mapStyle
      });
    } else {
      return json({ message: 'No structured output available.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return json({ message: 'An error occurred.', error }, { status: 500 });
  }
}
