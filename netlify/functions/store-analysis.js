// Store analysis data from N8N
// Simple in-memory storage (for production, use a database)
const analysisStore = new Map();

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Received analysis from N8N:', data);

    if (!data.requestId || !data.analysisData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing requestId or analysisData' })
      };
    }

    // Store the analysis data
    analysisStore.set(data.requestId, {
      ...data.analysisData,
      timestamp: new Date().toISOString(),
      ready: true
    });

    console.log(`Stored analysis for request ID: ${data.requestId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Analysis stored successfully',
        requestId: data.requestId
      })
    };

  } catch (error) {
    console.error('Error storing analysis:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to store analysis' })
    };
  }
};