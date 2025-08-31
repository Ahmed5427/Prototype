import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Users, DollarSign, AlertTriangle, TrendingUp, Zap, Shield, MessageSquare, FileText, CheckCircle } from 'lucide-react'

const Step3PainPointAnalysis = ({ data, onUpdate, onNext, onPrevious }) => {
  const [formData, setFormData] = useState({
    painPointCategories: data.painPointCategories || [],
    impactAssessment: data.impactAssessment || {},
    frequency: data.frequency || '',
    businessImpact: data.businessImpact || 0
  })

  const painPointOptions = [
    {
      id: 'time_consumption',
      title: 'Takes Too Long',
      icon: Clock,
      description: 'Process takes too much time to complete',
      color: 'text-blue-500'
    },
    {
      id: 'too_many_mistakes',
      title: 'Too Many Mistakes',
      icon: AlertTriangle,
      description: 'Lots of errors and things going wrong',
      color: 'text-orange-500'
    },
    {
      id: 'needs_many_people',
      title: 'Needs Too Many People',
      icon: Users,
      description: 'Requires too many people or resources',
      color: 'text-purple-500'
    },
    {
      id: 'costs_too_much',
      title: 'Costs Too Much',
      icon: DollarSign,
      description: 'Expensive to keep doing the current way',
      color: 'text-green-500'
    },
    {
      id: 'hard_to_grow',
      title: 'Hard to Handle More Work',
      icon: TrendingUp,
      description: 'Difficult when you get busier or grow',
      color: 'text-pink-500'
    },
    {
      id: 'poor_communication',
      title: 'Poor Communication',
      icon: MessageSquare,
      description: 'Information gets lost between people',
      color: 'text-indigo-500'
    },
    {
      id: 'messy_files',
      title: 'Messy Files & Records',
      icon: FileText,
      description: 'Hard to find or organize documents',
      color: 'text-cyan-500'
    },
    {
      id: 'rule_compliance',
      title: 'Hard to Follow Rules',
      icon: Shield,
      description: 'Difficult to meet required standards',
      color: 'text-red-500'
    }
  ]

  const frequencyOptions = [
    { value: 'multiple_daily', label: 'Many times per day', impact: 'Very High' },
    { value: 'daily', label: 'Every day', impact: 'High' },
    { value: 'weekly', label: 'Every week', impact: 'Medium' },
    { value: 'monthly', label: 'Every month', impact: 'Low' },
    { value: 'quarterly', label: 'Every few months', impact: 'Very Low' },
    { value: 'as_needed', label: 'Only when needed', impact: 'Variable' }
  ]

  const togglePainPoint = (painPointId) => {
    const isSelected = formData.painPointCategories.includes(painPointId)
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        painPointCategories: prev.painPointCategories.filter(id => id !== painPointId),
        impactAssessment: {
          ...prev.impactAssessment,
          [painPointId]: undefined
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        painPointCategories: [...prev.painPointCategories, painPointId],
        impactAssessment: {
          ...prev.impactAssessment,
          [painPointId]: 0
        }
      }))
    }
  }

  const updateImpactAssessment = (painPointId, value) => {
    setFormData(prev => ({
      ...prev,
      impactAssessment: {
        ...prev.impactAssessment,
        [painPointId]: value[0]
      }
    }))
  }

  const updateBusinessImpact = (value) => {
    setFormData(prev => ({ ...prev, businessImpact: value[0] }))
  }

  const getImpactLabel = (value) => {
    if (value < 25) return 'Minor Issue'
    if (value < 75) return 'Significant Issue'
    return 'Critical Issue'
  }

  const getBusinessImpactLabel = (value) => {
    if (value < 25) return 'key challenge'
    if (value < 75) return 'main issue'
    return 'critical concern'
  }

  const getImpactColor = (value) => {
    if (value < 25) return 'text-blue-600'
    if (value < 75) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleNext = () => {
    onUpdate(formData)
    onNext()
  }

  const canProceed = formData.painPointCategories.length > 0 && formData.frequency

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Pain Point Analysis</CardTitle>
        <CardDescription>
          Help us understand the specific challenges and their impact on your business
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Pain Point Categories */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">
            What problems do you have with your current process?
          </Label>
          <p className="text-sm text-gray-600">Choose all that apply to your situation</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPointOptions.map((option) => {
              const Icon = option.icon
              const isSelected = formData.painPointCategories.includes(option.id)
              
              return (
                <div
                  key={option.id}
                  onClick={() => togglePainPoint(option.id)}
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
                      <h3 className="font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Impact Assessment */}
        {formData.painPointCategories.length > 0 && (
          <div className="space-y-4">
            <Label className="text-lg font-medium">Impact Assessment</Label>
            <p className="text-sm text-gray-600">
              Rate how much each problem affects your business
            </p>
            
            {formData.painPointCategories.map((painPointId) => {
              const option = painPointOptions.find(opt => opt.id === painPointId)
              const value = formData.impactAssessment[painPointId] || 0
              
              return (
                <div key={painPointId} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <option.icon className={`w-5 h-5 ${option.color}`} />
                      <span className="font-medium">{option.title}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getImpactColor(value)}
                    >
                      {getImpactLabel(value)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Small Issue</span>
                      <span>Big Problem</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) => updateImpactAssessment(painPointId, newValue)}
                      max={100}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Process Frequency */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">How often does this process run?</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    <Badge variant="outline" className="ml-2">
                      {option.impact}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Overall Business Impact */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Overall Business Impact</Label>
          <p className="text-sm text-gray-600">
            How much would fixing these problems help your business?
          </p>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Business Impact Level</span>
              <Badge 
                variant="outline" 
                className={getImpactColor(formData.businessImpact)}
              >
                {getBusinessImpactLabel(formData.businessImpact)}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Small Help</span>
                <span>Huge Help</span>
              </div>
              <Slider
                value={[formData.businessImpact]}
                onValueChange={updateBusinessImpact}
                max={100}
                step={50}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious} className="squad-button-previous">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!canProceed}>
            Continue to Goals & Vision
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step3PainPointAnalysis