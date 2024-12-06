import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPEN_AI_KEY } from '$env/static/private';

const openai = new OpenAI({
  apiKey: OPEN_AI_KEY
});

const VECTOR_STORE_ID = 'vs_XcgsWWBBEVoK4paHiWXgFSYN';

async function queryVectorStore(query) {
  try {
    // First, create an embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Now search the vector store using the embedding
    const response = await openai.vectors.search({
      model: "text-embedding-ada-002",
      vector_store_id: VECTOR_STORE_ID,
      query_vector: queryEmbedding,
      max_results: 3
    });

    // console.log('Vector search response:', response);
    
    // Extract and return the relevant text from the matches
    return response.matches || [];
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
      // console.log('Parsed answer:', parsedData.answer);
      // console.log('Parsed recommendation:', parsedData.recommendation);

      return json({
        answer: parsedData.answer,
        recommendation: parsedData.recommendation,
        sourcesUsed: vectorResults.length > 0  // Optional: inform frontend if sources were used
      });
    } else {
      return json({ message: 'No structured output available.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return json({ message: 'An error occurred.', error }, { status: 500 });
  }
}