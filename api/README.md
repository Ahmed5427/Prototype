# Squad Form API Server

This API server receives analysis data from your n8n workflow and serves it to the React frontend.

## Setup

1. **Install dependencies:**
```bash
cd api
npm install
```

2. **Start the server:**
```bash
npm start
# or for development with auto-restart:
npm run dev
```

The server runs on `http://localhost:3001`

## API Endpoints

### For n8n Workflow (HTTP Request Node)

**POST** `/api/analysis/receive`
- **URL**: `http://localhost:3001/api/analysis/receive`
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "requestId": "your-request-id-from-form",
  "analysisData": {
    "problem": "Description of the main problem",
    "painPoints": "Analysis of pain points",
    "neededSolution": "Required solution description", 
    "proposedApproach": "Recommended approach",
    "constraints": "Technical/business constraints",
    "assumptions": "Key assumptions made",
    "risks": "Potential risks identified",
    "openQuestions": "Questions needing clarification", 
    "clientDraft": "Draft proposal for client"
  }
}
```

### For React Frontend

**GET** `/api/analysis/:requestId` - Get analysis data for a specific request
**GET** `/api/analysis/:requestId/status` - Check if analysis is ready

## n8n HTTP Request Node Configuration

In your n8n workflow, add an HTTP Request node at the end:

1. **Method**: POST
2. **URL**: `http://localhost:3001/api/analysis/receive`
3. **Headers**: 
   - `Content-Type`: `application/json`
4. **Body**: 
```json
{
  "requestId": "{{ $node['Form_Data'].json.requestId }}",
  "analysisData": {
    "problem": "{{ $node['AI_Analysis'].json.problem }}",
    "painPoints": "{{ $node['AI_Analysis'].json.painPoints }}",
    "neededSolution": "{{ $node['AI_Analysis'].json.neededSolution }}",
    "proposedApproach": "{{ $node['AI_Analysis'].json.proposedApproach }}",
    "constraints": "{{ $node['AI_Analysis'].json.constraints }}",
    "assumptions": "{{ $node['AI_Analysis'].json.assumptions }}",
    "risks": "{{ $node['AI_Analysis'].json.risks }}",
    "openQuestions": "{{ $node['AI_Analysis'].json.openQuestions }}",
    "clientDraft": "{{ $node['AI_Analysis'].json.clientDraft }}"
  }
}
```

## How It Works

1. User fills form in React app
2. Form generates a unique `requestId` 
3. React app shows "Waiting for AI Analysis..." with the requestId
4. Your n8n workflow processes the data
5. n8n sends analysis results to `/api/analysis/receive` with the requestId
6. React app polls `/api/analysis/{requestId}` every 3 seconds
7. When data arrives, React app displays the structured analysis

## Testing

Test the endpoint directly:
```bash
curl -X POST http://localhost:3001/api/analysis/receive \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": "test-123",
    "analysisData": {
      "problem": "Test problem description",
      "painPoints": "Test pain points"
    }
  }'
```