'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, User, GraduationCap, MapPin, CreditCard } from 'lucide-react';
import { z } from 'zod';

// ----------- Schemas for final validation -----------
const studentSchema = z.object({
  fullName: z.string().min(2).max(60).regex(/^[A-Za-z ]+$/).transform(val => val.trim()),
  email: z.string().email(),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  class: z.enum(['9','10','11','12']),
  board: z.enum(['CBSE','ICSE','State Board']),
  preferredLanguage: z.enum(['English','Hindi','Hinglish']),
});

const academicSchema = z.object({
  class: z.enum(["9", "10", "11", "12"]),
  subjects: z.array(z.string()).min(1),
  examGoal: z.enum(["Board Excellence", "Concept Mastery", "Competitive Prep"]),
  weeklyStudyHours: z.number().min(1).max(40),
  scholarship: z.boolean(),
  lastExamPercentage: z.number().min(0).max(100).optional(),
  achievements: z.string().optional(),
});

const addressGuardianSchema = z.object({
  pinCode: z.string().regex(/^\d{6}$/),
  state: z.string().min(2),
  city: z.string().min(2),
  addressLine: z.string().min(10).max(120),
  guardianName: z.string().min(2),
  guardianMobile: z.string().regex(/^[6-9]\d{9}$/),
  preferredPaymentPlan: z.enum(['Quarterly','Half-Yearly','Annual']),
  paymentMode: z.enum(['UPI','Card','NetBanking']),
});

// ----------- Component Interface -----------
interface Step4ReviewSubmitProps {
  data?: {
    studentDetails?: any;
    academicDetails?: any;
    addressGuardian?: any;
  };
  prevStep?: () => void;
  goToStep?: (step: number) => void;
  bookKey?: string;
}

// ----------- Component -----------
export default function Step4ReviewSubmit({ data, prevStep, goToStep, bookKey }: Step4ReviewSubmitProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setValidationError(null);
      
      // Validate all steps
      studentSchema.parse(data?.studentDetails);
      academicSchema.parse(data?.academicDetails);
      addressGuardianSchema.parse(data?.addressGuardian);

      setSubmitting(true);
      
      // Simulate API submission
      await new Promise(r => setTimeout(r, 2000));
      
      setSuccess(true);
      console.log('Enrollment Submitted Successfully:', data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError('Please check all form sections for missing or invalid information.');
      } else {
        setValidationError('An error occurred during submission. Please try again.');
      }
      console.error('Validation/Submission Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Success State
  if (success) {
    return (
      <PageContainer scrollable>
        <Card className="mx-auto mb-16 w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green-700">Enrollment Submitted Successfully!</h2>
                <p className="text-gray-600">Your application has been received and is being processed.</p>
              </div>
              
              <Alert className="text-left">
                <AlertDescription>
                  You will receive a confirmation email shortly with further instructions and payment details.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button 
                  onClick={() => setShowPayload(prev => !prev)}
                  variant="outline"
                  className="w-full"
                >
                  {showPayload ? 'Hide' : 'Show'} Submission Details
                </Button>
                
                {showPayload && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Submission Payload</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto max-h-96">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Step 4 - Review & Submit
          </CardTitle>
          <p className="text-gray-600">Please review all your information before submitting</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Validation Error Alert */}
          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Student Details Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Student Details</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => goToStep?.(1)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{data?.studentDetails?.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{data?.studentDetails?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">+91 {data?.studentDetails?.mobile || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">Class {data?.studentDetails?.class || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Board</p>
                  <p className="font-medium">{data?.studentDetails?.board || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Language</p>
                  <p className="font-medium">{data?.studentDetails?.preferredLanguage || 'Not selected'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Details Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">Academic Details</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => goToStep?.(2)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">Class {data?.academicDetails?.class || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Exam Goal</p>
                  <p className="font-medium">{data?.academicDetails?.examGoal || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weekly Study Hours</p>
                  <p className="font-medium">{data?.academicDetails?.weeklyStudyHours || 0} hours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scholarship Application</p>
                  <p className="font-medium">
                    {data?.academicDetails?.scholarship ? (
                      <Badge variant="secondary">Applied</Badge>
                    ) : (
                      <Badge variant="outline">Not Applied</Badge>
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Selected Subjects</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data?.academicDetails?.subjects?.map((subject: string) => (
                    <Badge key={subject} variant="default">{subject}</Badge>
                  )) || <span className="text-gray-400">No subjects selected</span>}
                </div>
              </div>

              {data?.academicDetails?.scholarship && (
                <>
                  {data?.academicDetails?.lastExamPercentage && (
                    <div>
                      <p className="text-sm text-gray-500">Last Exam Percentage</p>
                      <p className="font-medium">{data.academicDetails.lastExamPercentage}%</p>
                    </div>
                  )}
                  
                  {data?.academicDetails?.achievements && (
                    <div>
                      <p className="text-sm text-gray-500">Achievements</p>
                      <p className="font-medium">{data.academicDetails.achievements}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Address & Guardian Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg">Address & Guardian Details</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => goToStep?.(3)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Address Information */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">PIN Code</p>
                    <p className="font-medium">{data?.addressGuardian?.pinCode || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium">{data?.addressGuardian?.state || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{data?.addressGuardian?.city || 'Not provided'}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Full Address</p>
                  <p className="font-medium">{data?.addressGuardian?.addressLine || 'Not provided'}</p>
                </div>
              </div>

              {/* Guardian Information */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Guardian Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Guardian Name</p>
                    <p className="font-medium">{data?.addressGuardian?.guardianName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guardian Mobile</p>
                    <p className="font-medium">+91 {data?.addressGuardian?.guardianMobile || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Preferences
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Plan</p>
                    <p className="font-medium">{data?.addressGuardian?.preferredPaymentPlan || 'Not selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Mode</p>
                    <p className="font-medium">{data?.addressGuardian?.paymentMode || 'Not selected'}</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Final Submission */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Ready to Submit?</h3>
                  <p className="text-gray-600">
                    Please review all the information above. Once submitted, you will receive a confirmation email.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={submitting}
                  >
                    Previous Step
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={submitting}
                    className="min-w-[150px]"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Enrollment'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </PageContainer>
  );
}