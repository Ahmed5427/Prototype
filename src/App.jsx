import { useState } from 'react';
import FormProgress from './components/FormProgress';
import Step1ProjectBasics from './components/steps/Step1ProjectBasics';
import Step2ProcessDiscovery from './components/steps/Step2ProcessDiscovery';
import Step3PainPointAnalysis from './components/steps/Step3PainPointAnalysis';
import Step4AutomationVision from './components/steps/Step4AutomationVision';
import Step5SummaryReview from './components/steps/Step5SummaryReview'; // Import the new component
import ThankYouPage from './components/ThankYouPage';
import './App.css';
import './styles/squad-theme.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPrototypePlan, setShowPrototypePlan] = useState(false);

  const steps = [
    { id: 1, title: 'Project Basics', estimate: '2 min' },
    { id: 2, title: 'Process Discovery', estimate: '4-6 min' },
    { id: 3, title: 'Pain Point Analysis', estimate: '3-5 min' },
    { id: 4, title: 'Goals & Vision', estimate: '3-5 min' },
    { id: 5, title: 'Summary Review', estimate: '1-2 min' },
  ];

  const updateFormData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleApprove = (data) => {
    // In a real application, you would make an API call to the backend/n8n
    // with the final approved form data to generate the prototype plan.
    // For now, we simulate this by just showing the thank you page.
    console.log('Client has approved the summary. Generating prototype plan...');
    setShowPrototypePlan(true);
  };

  const handleReject = (data) => {
    // In a real application, you would send the client's note to the backend/AI
    // and let the AI re-generate the summary.
    console.log('Client requested changes:', data.changesRequested);
    // This example just stays on the same page, but in a real app,
    // you would update the state with a new summary from the AI.
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ProjectBasics
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2ProcessDiscovery
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 3:
        return (
          <Step3PainPointAnalysis
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 4:
        return (
          <Step4AutomationVision
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep} // Now navigates to the new summary review step
            onPrevious={previousStep}
          />
        );
      case 5:
        return (
          <Step5SummaryReview
            data={formData}
            onUpdate={updateFormData}
            onNext={() => setIsCompleted(true)} // This function now leads to the thank you page
            onPrevious={previousStep}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/squad-logo.png" 
              alt="SQUAD" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SQUAD Automation Request Form
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A smarter way to discover your automation needs and unlock your team's potential
          </p>
        </div>

        {/* Show Thank You Page or Form */}
        {isCompleted ? (
          <ThankYouPage onStartNew={() => {
            setIsCompleted(false);
            setShowPrototypePlan(false);
            setCurrentStep(1);
            setFormData({});
          }} />
        ) : (
          <>
            {/* Progress Indicator */}
            <FormProgress steps={steps} currentStep={currentStep} />

            {/* Form Content */}
            <div className="mt-8">
              {renderCurrentStep()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;