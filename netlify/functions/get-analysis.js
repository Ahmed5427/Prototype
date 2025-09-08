// netlify/functions/get-analysis.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const requestId = event.queryStringParameters?.requestId;
    
    if (!requestId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'requestId parameter is required' })
      };
    }

    console.log(`Looking for analysis data for requestId: ${requestId}`);
    
    // Call your Google Apps Script to check for analysis results
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxZ_3PAb-Ig1r9FiYaeJYN3lXy49i0ytyTjV5up1hBUbkZLPpQoBjDX3-7hvjynzHaZ/exec';
    
    try {
      const response = await fetch(`${scriptUrl}?action=getAnalysis&requestId=${requestId}`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.analysisData) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              analysisData: data.analysisData,
              ready: true,
              timestamp: data.timestamp
            })
          };
        }
      }
    } catch (fetchError) {
      console.log('Google Sheets not ready yet:', fetchError.message);
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: 'Analysis data not found',
        message: 'Analysis not ready yet - n8n is still processing',
        requestId: requestId,
        ready: false
      })
    };

  } catch (error) {
    console.error('Error retrieving analysis:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve analysis data' })
    };
  }
};
