import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';

const openai = new OpenAI({
  apiKey: OPEN_AI_KEY
});

// Add your vector store API key if required
const VECTOR_STORE_ID = 'vs_XcgsWWBBEVoK4paHiWXgFSYN';

async function queryVectorStore(query) {
  try {
    const response = await fetch('https://api.metaphor.systems/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers for your vector store
      },
      body: JSON.stringify({
        vectorStoreId: VECTOR_STORE_ID,
        query: query,
        numResults: 3  // Adjust based on your needs
      })
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Vector store query error:', error);
    return [];
  }
}

export async function POST({ request }) {
  const { message } = await request.json();

  try {
    // First, query the vector store
    const vectorResults = await queryVectorStore(message);
    
    // Format vector store results into a context string
    const contextFromVectorStore = vectorResults.length > 0 
      ? "Based on the following relevant information from research papers:\n\n" + 
        vectorResults.map(result => result.text).join('\n\n')
      : "";

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant specializing in geospatial analysis for the Amazon region, focusing on health, climate, and deforestation. Provide concise answers, and generate a map style when required. ${contextFromVectorStore}`
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
                description: 'The user shared the property they are visualizing on the map. Using the context from the research papers when relevant, explain the significance and meaning of the property that is being visualized'
              },
              recommendation: {
                type: 'string',
                description: "The user shared with you the other properties they have access to and which one they are visualizing now. Based on insights from the research papers when applicable, recommend one of the other properties and explain why it would add context to the current visualization."
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
        recommendation: parsedData.recommendation,
        sourcesUsed: vectorResults.length > 0  // inform frontend if sources were used
      });
    } else {
      return json({ message: 'No structured output available.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return json({ message: 'An error occurred.', error }, { status: 500 });
  }
}