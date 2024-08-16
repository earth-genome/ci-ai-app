import { json } from '@sveltejs/kit';
import AWS from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '$env/static/private';

AWS.config.update({
	region: 'us-east-2',
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const lambda = new AWS.Lambda();

async function invokeLambda(prompt) {
	const params = {
		FunctionName: 'ci-ai-openai-lambda',
		Payload: JSON.stringify({ prompt: prompt }),
		// InvocationType: 'RequestResponse'
	};

	try {
		const result = await lambda.invoke(params).promise();
		const payload = JSON.parse(result.Payload);
		if (payload.statusCode !== 200) {
			throw new Error(JSON.parse(payload.body).error);
		}
        let resp = JSON.parse(payload.body)
        console.log("resp: ", resp)
		return resp;
	} catch (error) {
		console.error('Error invoking Lambda:', error);
		throw error;
	}
}

export async function POST({ request }) {
	const { message } = await request.json();

	try {
		const response = await invokeLambda(message);
    
		return new Response(response.response, {
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	} catch (error) {
		console.error('Error:', error);
		return new Response(JSON.stringify({ error: 'An error occurred' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

export async function GET() {
  console.log('POST request received');
	return new Response('This endpoint only supports POST requests for responses from Lambda.', {
		status: 405,
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}

