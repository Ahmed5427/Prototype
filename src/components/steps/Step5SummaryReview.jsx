import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { CheckCircle, MessageCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Step5SummaryReview = ({ data, onUpdate, onNext, onPrevious, onApprove, onReject }) => {
  const [clientNote, setClientNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [summary, setSummary] = useState(data.generatedSummary || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [aiAnalysisReady, setAiAnalysisReady] = useState(false);

  // Poll for AI analysis results
  useEffect(() => {
    if (!data.requestId) {
      setIsLoadingAI(false);
      return;
    }

    const pollForAnalysis = async () => {
      try {
        // Try to fetch from your Netlify function or API endpoint
        const response = await fetch(`/.netlify/functions/get-analysis?requestId=${data.requestId}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.analysisData && result.analysisData.clientDraft) {
            setSummary(result.analysisData.clientDraft);
            setAiAnalysisReady(true);
            setIsLoadingAI(false);
            return;
          }
        }
      } catch (error) {
        console.log('Still waiting for AI analysis...', error);
      }

      // Continue polling every 3 seconds for up to 2 minutes
      setTimeout(pollForAnalysis, 3000);
    };

    // Start polling after a short delay
    const timeoutId = setTimeout(pollForAnalysis, 2000);

    // Stop polling after 2 minutes
    const maxWaitId = setTimeout(() => {
      setIsLoadingAI(false);
      if (!aiAnalysisReady) {
        setSummary("AI analysis is taking longer than expected. Our team will review your submission and get back to you shortly.");
      }
    }, 120000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(maxWaitId);
    };
  }, [data.requestId, aiAnalysisReady]);

  const generateSummary = () => {
    const summaryData = {
      project: data.projectName || '',
      company: data.companyName || '',
      processType: data.processType || '',
      processSteps: data.processSteps && data.processSteps.length > 0
        ? data.processSteps.map(step => ({ description: step.description, automationVision: step.automationVision }))
        : [],
      painPoints: data.painPointCategories || [],
      goals: data.outcomePriorities || [],
      metrics: data.successMetrics || '',
      technicalContext: {
        existingTools: data.existingTools || [],
        dataSource: data.dataSource || '',
        outputDestination: data.outputDestination || '',
        timeline: data.timeline || '',
        budget: data.budget || '',
        technicalConstraints: data.technicalConstraints || '',
        niceToHave: data.niceToHave || [],
        securityRequirements: data.securityRequirements || '',
        scalabilityNeeds: data.scalabilityNeeds || ''
      }
    };
    return JSON.stringify(summaryData, null, 2);
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const response = await new Promise(resolve => setTimeout(() => resolve({ ok: true }), 1500));
      
      if (response.ok) {
        setIsApproved(true);
        onApprove(data);
      } else {
        alert('⚠ There was an issue processing your approval. The team will reach out to you.');
        onReject();
      }
    } catch (error) {
      alert('⚠ There was an error communicating with the server. The team will reach out to you.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestChanges = async () => {
    if (clientNote.trim() === '') {
      alert('Please enter a note describing the requested changes.');
      return;
    }
    setIsProcessing(true);
    try {
      const response = await new Promise(resolve => setTimeout(() => resolve({ 
        ok: true, 
        updatedSummary: `Updated Summary based on client note: "${clientNote}"\n\n` + (summary || generateSummary())
      }), 2000));
      
      if (response.ok) {
        setSummary(response.updatedSummary);
        setClientNote('');
        setShowNoteInput(false);
        onReject({ changesRequested: clientNote }); 
      } else {
        alert('⚠ We couldn\'t process your change request. The team will reach out to you.');
        onReject();
      }
    } catch (error) {
      alert('⚠ There was an error communicating with the server. The team will reach out to you.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 md:p-8">
      <CardTitle className="text-3xl font-bold text-center mb-6">Final Summary</CardTitle>
      
      <CardContent className="space-y-6">
        {/* Status and Summary Section */}
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            isLoadingAI ? 'bg-blue-50 border-blue-200' : 
            aiAnalysisReady ? 'bg-green-50 border-green-200' : 
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-3">
              {isLoadingAI ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : aiAnalysisReady ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : isProcessing ? (
                <Clock className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  isLoadingAI ? 'text-blue-800' : 
                  aiAnalysisReady ? 'text-green-800' : 
                  'text-yellow-800'
                }`}>
                  {isLoadingAI ? 'AI is analyzing your submission...' : 
                   aiAnalysisReady ? 'AI Analysis Complete!' : 
                   isProcessing ? 'Processing Request...' : 
                   'Please review the summary below'}
                </p>
                <p className={`text-sm mt-1 ${
                  isLoadingAI ? 'text-blue-700' : 
                  aiAnalysisReady ? 'text-green-700' : 
                  'text-yellow-700'
                }`}>
                  {isLoadingAI ? 'This usually takes 30-60 seconds. Please wait...' : 
                   aiAnalysisReady ? 'Your personalized analysis is ready for review.' :
                   'Please review the summary and select your action below.'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-xl text-gray-900 mb-2">
              {aiAnalysisReady ? 'AI-Generated Analysis' : 'Summary'}
            </h3>
            <Separator className="mb-4" />
            
            {isLoadingAI ? (
              <div className="flex items-center justify-center p-8 bg-white border rounded-md">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <p className="text-sm text-gray-600">Analyzing your requirements...</p>
                  <p className="text-xs text-gray-500">Request ID: {data.requestId}</p>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm text-gray-800 p-4 bg-white border rounded-md max-h-72 overflow-y-auto leading-relaxed">
                {summary || generateSummary()}
              </div>
            )}
          </div>
        </div>

        {/* Action Section - Only show when AI analysis is ready or timed out */}
        {!isLoadingAI && (
          <div className="space-y-4">
            {!showNoteInput ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleApprove} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!aiAnalysisReady && summary.includes('AI analysis is taking longer')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button 
                  onClick={() => setShowNoteInput(true)} 
                  variant="outline" 
                  className="flex-1"
                  disabled={!aiAnalysisReady && summary.includes('AI analysis is taking longer')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Request Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="client-note" className="flex items-center gap-2 text-sm text-gray-700">
                  <MessageCircle className="w-4 h-4" /> Your Changes/Notes
                </Label>
                <Textarea
                  id="client-note"
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                  placeholder="E.g., Please clarify the proposed timeline..."
                  rows={3}
                  className="mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button onClick={() => setShowNoteInput(false)} variant="ghost" className="text-gray-600">
                    Cancel
                  </Button>
                  <Button onClick={handleRequestChanges} disabled={clientNote.trim() === ''}>
                    Submit Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={onPrevious} className="text-gray-600">
            Previous
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!isApproved && !(!aiAnalysisReady && summary.includes('AI analysis is taking longer'))} 
            className="bg-green-600 hover:bg-green-700"
          >
            {isApproved ? 'Finish' : 'Submit Request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step5SummaryReview;