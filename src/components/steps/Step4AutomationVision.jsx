import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Clock, Zap, Shield, TrendingUp, Users, Star, ArrowUp, ArrowDown } from 'lucide-react'

const Step4AutomationVision = ({ data, onUpdate, onNext, onPrevious }) => {
  const [formData, setFormData] = useState({
    outcomePriorities: data.outcomePriorities || [],
    successMetrics: data.successMetrics || '',
    timelinePriority: data.timelinePriority || 50,
    costPriority: data.costPriority || 50,
    additionalGoals: data.additionalGoals || ''
  })

  const outcomeOptions = [
    {
      id: 'reduce_time',
      title: 'Save Time',
      icon: Clock,
      description: 'Make tasks faster and quicker to complete',
      color: 'text-blue-500'
    },
    {
      id: 'eliminate_errors',
      title: 'Reduce Mistakes',
      icon: Shield,
      description: 'Make fewer errors and improve accuracy',
      color: 'text-red-500'
    },
    {
      id: 'improve_compliance',
      title: 'Follow Rules Better',
      icon: Shield,
      description: 'Meet required standards more easily',
      color: 'text-green-500'
    },
    {
      id: 'scale_operations',
      title: 'Handle More Work',
      icon: TrendingUp,
      description: 'Deal with growth and increased volume',
      color: 'text-purple-500'
    },
    {
      id: 'enhance_experience',
      title: 'Make People Happier',
      icon: Users,
      description: 'Improve experience for users and customers',
      color: 'text-orange-500'
    },
    {
      id: 'increase_visibility',
      title: 'Better Tracking',
      icon: Star,
      description: 'See what\'s happening and get better reports',
      color: 'text-indigo-500'
    }
  ]

  const toggleOutcome = (outcomeId) => {
    const isSelected = formData.outcomePriorities.includes(outcomeId)
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        outcomePriorities: prev.outcomePriorities.filter(id => id !== outcomeId)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        outcomePriorities: [...prev.outcomePriorities, outcomeId]
      }))
    }
  }

  const moveOutcome = (outcomeId, direction) => {
    const currentIndex = formData.outcomePriorities.indexOf(outcomeId)
    if (currentIndex === -1) return

    const newPriorities = [...formData.outcomePriorities]
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex >= 0 && newIndex < newPriorities.length) {
      [newPriorities[currentIndex], newPriorities[newIndex]] = [newPriorities[newIndex], newPriorities[currentIndex]]
      setFormData(prev => ({ ...prev, outcomePriorities: newPriorities }))
    }
  }

  const updateSlider = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }))
  }

  const getSliderLabel = (value) => {
    if (value <= 0) return 'Flexible'
    if (value <= 50) return 'Standard'
    return 'Urgent'
  }

  const getSliderColor = (value) => {
    if (value <= 0) return 'text-blue-600'
    if (value <= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleNext = async () => {
    onUpdate(formData);
    
    try {
      // Generate request ID for n8n workflow tracking
      const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      
      // Prepare the complete form data for submission
      const completeFormData = {
        ...data,
        ...formData,
        requestId: requestId, // Add request ID for n8n workflow
        companyName: data.companyName || '',
        department: data.department || '',
        projectName: data.projectName || '',
        requesterName: data.requesterName || '',
        email: data.requesterEmail || data.email || '',
        processType: data.processType || '',
        otherProcessName: data.otherProcessName || '',
        customProcessDescription: data.customProcessDescription || '',
        processSteps: data.processSteps || [],
        painPointCategories: data.painPointCategories || [],
        impactAssessment: data.impactAssessment || data.painPointImpacts || {},
        frequency: data.frequency || '',
        businessImpact: data.businessImpact || 50,
        outcomePriorities: formData.outcomePriorities || [],
        successMetrics: formData.successMetrics || '',
        timelinePriority: formData.timelinePriority || 50,
        costPriority: formData.costPriority || 50,
        additionalGoals: formData.additionalGoals || ''
      };
      
      // Save request ID to the form data so Step 5 can use it
      onUpdate({ ...formData, requestId: requestId });

      console.log('Submitting form data:', completeFormData);
      
      await fetch('https://script.google.com/macros/s/AKfycbxZ_3PAb-Ig1r9FiYaeJYN3lXy49i0ytyTjV5up1hBUbkZLPpQoBjDX3-7hvjynzHaZ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completeFormData)
      });

      console.log('Form submitted successfully (no-cors mode)');
      onNext();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ There was an error submitting your form. Please try again or contact the SQUAD team for support.');
    }
  }

  const canProceed = formData.outcomePriorities.length > 0

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Goals & Vision</CardTitle>
        <CardDescription>
          Tell us what you want to achieve and how you see automation helping
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Outcome Priorities */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">
            What are your main goals for this automation?
          </Label>
          <p className="text-sm text-gray-600">Choose your most important goals</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outcomeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = formData.outcomePriorities.includes(option.id)
              const priority = formData.outcomePriorities.indexOf(option.id) + 1
              
              return (
                <div
                  key={option.id}
                  onClick={() => toggleOutcome(option.id)}
                  className={`
                    p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Icon className={`w-6 h-6 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{option.title}</h3>
                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <Badge variant="default" className="text-xs">
                              #{priority}
                            </Badge>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveOutcome(option.id, 'up')
                                }}
                                disabled={priority === 1}
                                className="h-4 w-4 p-0"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveOutcome(option.id, 'down')
                                }}
                                disabled={priority === formData.outcomePriorities.length}
                                className="h-4 w-4 p-0"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Success Metrics</Label>
          <p className="text-sm text-gray-600">
            Tell us how you'll measure success (e.g., "Save 2 hours per day", "Reduce errors by half")
          </p>
          <Textarea
            value={formData.successMetrics}
            onChange={(e) => setFormData(prev => ({ ...prev, successMetrics: e.target.value }))}
            placeholder="Describe specific, measurable goals for this automation..."
            rows={3}
          />
        </div>

        {/* Project Priorities */}
        <div className="space-y-6">
          <Label className="text-lg font-medium">Project Priorities</Label>
          <p className="text-sm text-gray-600">
            Help us understand what matters most for this project
          </p>

          {/* Timeline Priority */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Timeline Priority</span>
              </div>
              <Badge 
                variant="outline" 
                className={getSliderColor(formData.timelinePriority)}
              >
                {getSliderLabel(formData.timelinePriority)}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Flexible Timeline</span>
                <span>Urgent Delivery</span>
              </div>
              <Slider
                value={[formData.timelinePriority]}
                onValueChange={(value) => updateSlider('timelinePriority', value)}
                max={100}
                step={50}
                className="w-full"
              />
            </div>
          </div>

          {/* Cost Priority */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                <span className="font-medium">Cost Efficiency Priority</span>
              </div>
              <Badge 
                variant="outline" 
                className={getSliderColor(formData.costPriority)}
              >
                {getSliderLabel(formData.costPriority)}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Budget Flexible</span>
                <span>Cost Critical</span>
              </div>
              <Slider
                value={[formData.costPriority]}
                onValueChange={(value) => updateSlider('costPriority', value)}
                max={100}
                step={50}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Additional Goals */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Additional Goals (Optional)</Label>
          <p className="text-sm text-gray-600">
            Any other objectives or considerations for this automation project?
          </p>
          <Textarea
            value={formData.additionalGoals}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalGoals: e.target.value }))}
            placeholder="Describe any additional goals, constraints, or considerations..."
            rows={3}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button 
            onClick={onPrevious} 
            variant="outline" 
            className="squad-button-previous"
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} className="squad-button-primary">
            Complete Form
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step4AutomationVision