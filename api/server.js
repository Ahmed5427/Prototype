const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for analysis data (you can replace with a database)
const analysisDataStore = new Map();

// Endpoint for n8n to POST analysis data
app.post('/api/analysis/receive', (req, res) => {
  try {
    console.log('Received analysis data from n8n:', req.body);
    
    const { requestId, analysisData } = req.body;
    
    if (!requestId) {
      return res.status(400).json({ error: 'requestId is required' });
    }

    // Store the analysis data with requestId as key
    analysisDataStore.set(requestId, {
      ...analysisData,
      timestamp: new Date().toISOString(),
      received: true
    });

    console.log(`Analysis data stored for requestId: ${requestId}`);
    
    res.json({ 
      success: true, 
      message: 'Analysis data received and stored',
      requestId: requestId
    });
  } catch (error) {
    console.error('Error storing analysis data:', error);
    res.status(500).json({ error: 'Failed to store analysis data' });
  }
});

// Endpoint for React app to GET analysis data
app.get('/api/analysis/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(`Fetching analysis data for requestId: ${requestId}`);
    
    const analysisData = analysisDataStore.get(requestId);
    
    if (!analysisData) {
      return res.status(404).json({ error: 'Analysis data not found' });
    }
    
    res.json(analysisData);
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    res.status(500).json({ error: 'Failed to fetch analysis data' });
  }
});

// Endpoint to check if analysis is ready
app.get('/api/analysis/:requestId/status', (req, res) => {
  try {
    const { requestId } = req.params;
    const analysisData = analysisDataStore.get(requestId);
    
    res.json({
      ready: !!analysisData,
      timestamp: analysisData?.timestamp || null
    });
  } catch (error) {
    console.error('Error checking analysis status:', error);
    res.status(500).json({ error: 'Failed to check analysis status' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`n8n should POST to: http://localhost:${PORT}/api/analysis/receive`);
});