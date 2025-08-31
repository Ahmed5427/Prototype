import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

const ThankYouPage = ({ onStartNew }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 squad-text-secondary" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">Thank You!</CardTitle>
        <CardDescription className="text-lg">
          Your automation request has been successfully submitted
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We've received your automation request and our SQUAD team will review it carefully. 
            You'll hear back from us within 24-48 hours with next steps.
          </p>
        </div>

        <div className="flex justify-center pt-6">
          <Button 
            onClick={onStartNew}
            variant="outline"
            className="px-8"
          >
            Submit Another Request
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ThankYouPage

