import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import FileUpload from '@/components/ui/file-upload'
import { Clock, Plus, X, AlertTriangle, Users, RotateCcw, FileText, Headphones, DollarSign, TrendingUp, Settings } from 'lucide-react'

const Step2ProcessDiscovery = ({ data, onUpdate, onNext, onPrevious }) => {
  const [formData, setFormData] = useState({
    processType: data.processType || '',
    processSteps: data.processSteps || [],
    customProcessDescription: data.customProcessDescription || '',
    otherProcessName: data.otherProcessName || ''
  })

  const [newStep, setNewStep] = useState('')
  const [automationVision, setAutomationVision] = useState('')
  const [stepTime, setStepTime] = useState('')
  const [peopleInvolved, setPeopleInvolved] = useState('')
  const [stepFrequency, setStepFrequency] = useState('')
  const [stepPainPoints, setStepPainPoints] = useState([])
  const [stepAttachments, setStepAttachments] = useState([])

  const processTypes = [
    {
      id: 'hr_recruitment',
      title: 'HR & Hiring',
      icon: Users
    },
    {
      id: 'customer_service',
      title: 'Customer Support',
      icon: Headphones
    },
    {
      id: 'sales_process',
      title: 'Sales & Leads',
      icon: TrendingUp
    },
    {
      id: 'finance_admin',
      title: 'Finance & Admin',
      icon: DollarSign
    },
    {
      id: 'custom_process',
      title: 'Other Process',
      icon: Settings
    }
  ]

  const painPointOptions = [
    'Time consuming',
    'Error prone',
    'Repetitive',
    'Manual data entry',
    'Waiting for approvals',
    'Communication delays',
    'File management issues',
    'Compliance concerns'
  ]

  const addProcessStep = () => {
    if (newStep.trim()) {
      const step = {
        id: Date.now(),
        description: newStep.trim(),
        automationVision: automationVision.trim(),
        estimatedTime: stepTime.trim(),
        peopleInvolved: peopleInvolved.trim(),
        frequency: stepFrequency.trim(),
        painPoints: [...stepPainPoints],
        attachments: [...stepAttachments]
      }
      
      setFormData(prev => ({
        ...prev,
        processSteps: [...prev.processSteps, step]
      }))
      
      // Reset form
      setNewStep('')
      setAutomationVision('')
      setStepTime('')
      setPeopleInvolved('')
      setStepFrequency('')
      setStepPainPoints([])
      setStepAttachments([])
    }
  }

  const removeProcessStep = (stepId) => {
    setFormData(prev => ({
      ...prev,
      processSteps: prev.processSteps.filter(step => step.id !== stepId)
    }))
  }

  const togglePainPoint = (painPoint) => {
    setStepPainPoints(prev => 
      prev.includes(painPoint) 
        ? prev.filter(p => p !== painPoint)
        : [...prev, painPoint]
    )
  }

  const handleProcessTypeSelect = (typeId) => {
    setFormData(prev => ({ ...prev, processType: typeId }))
  }

  const handleNext = () => {
    const updatedData = {
      ...formData,
      processSteps: formData.processSteps.length > 0 ? formData.processSteps : []
    }
    onUpdate(updatedData)
    onNext()
  }

  const isCustomProcess = formData.processType === 'custom_process'
  const canProceed = formData.processType && (
    !isCustomProcess || 
    (isCustomProcess && formData.otherProcessName.trim() && (formData.customProcessDescription.trim() || formData.processSteps.length > 0))
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Process Discovery</CardTitle>
        <CardDescription>
          Help us understand your current process so we can design the best automation solution
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Process Type Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">What type of process are you looking to automate?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processTypes.map((type) => {
              const Icon = type.icon
              const isSelected = formData.processType === type.id
              
              return (
                <div
                  key={type.id}
                  onClick={() => handleProcessTypeSelect(type.id)}
                  className={`
                    border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 p-4">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {type.title}
                    </h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* NEW: Other Process Name and Description */}
        {isCustomProcess && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otherProcessName">Process Name <span className="text-red-500">*</span></Label>
              <Input
                id="otherProcessName"
                value={formData.otherProcessName}
                onChange={(e) => setFormData(prev => ({ ...prev, otherProcessName: e.target.value }))}
                placeholder="e.g., Inventory Management, Quality Control, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customDescription">Describe your process</Label>
              <Textarea
                id="customDescription"
                value={formData.customProcessDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, customProcessDescription: e.target.value }))}
                placeholder="Please provide a detailed description of the process you want to automate..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Process Steps Builder */}
        {formData.processType && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Current Process Steps</Label>
              <span className="text-sm text-gray-500">
                {formData.processSteps.length} steps added
              </span>
            </div>
            
            {/* Existing Steps */}
            {formData.processSteps.length > 0 && (
              <div className="space-y-3">
                {formData.processSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium text-sm text-gray-700">Current Manual Process:</p>
                          <p className="text-gray-900">{step.description}</p>
                        </div>
                        
                        {step.automationVision && (
                          <div>
                            <p className="font-medium text-sm text-gray-700">Automation Vision:</p>
                            <p className="text-blue-700 italic">{step.automationVision}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {step.estimatedTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{step.estimatedTime}</span>
                            </div>
                          )}
                          {step.peopleInvolved && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{step.peopleInvolved}</span>
                            </div>
                          )}
                          {step.frequency && (
                            <div className="flex items-center gap-1">
                              <RotateCcw className="w-4 h-4" />
                              <span>{step.frequency}</span>
                            </div>
                          )}
                        </div>
                        
                        {step.painPoints.length > 0 && (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <div className="flex gap-1">
                              {step.painPoints.map((point, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {point}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* NEW: Display attachments */}
                        {step.attachments && step.attachments.length > 0 && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <div className="flex gap-1">
                              {step.attachments.map((file, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                                  {file.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProcessStep(step.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Step */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
              <h4 className="font-medium text-gray-900">Add Process Step</h4>
              
              <div className="space-y-2">
                <Label htmlFor="newStep">Current Manual Step</Label>
                <Textarea
                  id="newStep"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Describe what happens manually in this step..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="automationVision">How do you imagine automation could handle this?</Label>
                <Textarea
                  id="automationVision"
                  value={automationVision}
                  onChange={(e) => setAutomationVision(e.target.value)}
                  placeholder="Describe how you envision automation working for this step..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stepTime">Time Currently Takes</Label>
                  <Input
                    id="stepTime"
                    value={stepTime}
                    onChange={(e) => setStepTime(e.target.value)}
                    placeholder="e.g., 15 min, 2 hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peopleInvolved">People Involved</Label>
                  <Input
                    id="peopleInvolved"
                    value={peopleInvolved}
                    onChange={(e) => setPeopleInvolved(e.target.value)}
                    placeholder="e.g., 2 people, 1 manager"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">How Often</Label>
                  <Input
                    id="frequency"
                    value={stepFrequency}
                    onChange={(e) => setStepFrequency(e.target.value)}
                    placeholder="e.g., daily, weekly"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pain Points (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {painPointOptions.map((point) => (
                    <Badge
                      key={point}
                      variant={stepPainPoints.includes(point) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePainPoint(point)}
                    >
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* NEW: File Attachments */}
              <div className="space-y-2">
                <Label>Attachments (optional)</Label>
                <p className="text-sm text-gray-600">Upload any relevant documents, screenshots, or files for this step</p>
                <FileUpload
                  onFileSelect={(files) => setStepAttachments(files)}
                  multiple={true}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.xlsx,.xls"
                />
                {stepAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stepAttachments.map((file, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={addProcessStep} disabled={!newStep.trim()} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious} className="squad-button-previous">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!canProceed}>
            Continue to Pain Point Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step2ProcessDiscovery
