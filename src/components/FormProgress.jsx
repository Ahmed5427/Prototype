const FormProgress = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          const isPending = step.id > currentStep

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${isActive ? 'squad-progress-active' : ''}
                    ${isCompleted ? 'squad-progress-completed' : ''}
                    ${isPending ? 'squad-progress-pending' : ''}
                  `}
                >
                  {step.id}
                </div>
                
                {/* Step Info */}
                <div className="ml-3 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'squad-text-primary' : 'text-gray-900'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.estimate}</p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div 
                    className={`h-0.5 transition-all duration-200 ${
                      isCompleted ? 'bg-squad-secondary' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FormProgress

