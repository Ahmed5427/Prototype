import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Building2, Users, Briefcase, User, AlertCircle } from 'lucide-react'

const Step1ProjectBasics = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    department: data.department || '',
    projectName: data.projectName || '',
    requesterName: data.requesterName || '',
    requesterEmail: data.requesterEmail || ''
  })

  const [errors, setErrors] = useState({})
  const departments = [
    'Marketing',
    'Sales',
    'Operations',
    'Human Resources',
    'Finance',
    'Customer Success',
    'Design',
    'Business Development',
    'Legal',
    'Other'
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required'
    }
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required'
    }
    
    if (!formData.requesterName.trim()) {
      newErrors.requesterName = 'Requester name is required'
    }
    
    if (!formData.requesterEmail.trim()) {
      newErrors.requesterEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.requesterEmail)) {
      newErrors.requesterEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData)
      onNext()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Project Basics</CardTitle>
        <CardDescription>
          Let's start with some basic information about your automation project
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter your company name"
            className={errors.companyName ? 'border-red-500' : ''}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.companyName}
            </p>
          )}
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Department <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.department}
            </p>
          )}
        </div>

        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="projectName" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            value={formData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            placeholder="e.g., HR Interview Automation, Invoice Processing System"
            className={errors.projectName ? 'border-red-500' : ''}
          />
          {errors.projectName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.projectName}
            </p>
          )}
        </div>

        {/* Requester Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="requesterName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="requesterName"
              value={formData.requesterName}
              onChange={(e) => handleInputChange('requesterName', e.target.value)}
              placeholder="Enter your full name"
              className={errors.requesterName ? 'border-red-500' : ''}
            />
            {errors.requesterName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.requesterName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requesterEmail">Email Address <span className="text-red-500">*</span></Label>
            <Input
              id="requesterEmail"
              type="email"
              value={formData.requesterEmail}
              onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
              placeholder="your.email@company.com"
              className={errors.requesterEmail ? 'border-red-500' : ''}
            />
            {errors.requesterEmail && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.requesterEmail}
              </p>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end pt-6">
          <Button onClick={handleNext} className="px-8">
            Continue to Process Discovery
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step1ProjectBasics

