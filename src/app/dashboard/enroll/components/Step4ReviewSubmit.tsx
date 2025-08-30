'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
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
  // Define your academic fields here if needed for validation
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

// ----------- Component -----------
export default function Step4ReviewSubmit({ data, prevStep, goToStep }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPayload, setShowPayload] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validate all steps
      studentSchema.parse(data.studentDetails);
      academicSchema.parse(data.academicDetails);
      addressGuardianSchema.parse(data.addressGuardian);

      setSubmitting(true);
      await new Promise(r => setTimeout(r, 1000)); // simulate submission
      setSuccess(true);
      console.log('Enrollment Submitted:', data);
    } catch (err) {
      alert('Validation failed. Please check your inputs.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <Alert variant="default">Enrollment submitted successfully!</Alert>
        <Button onClick={() => setShowPayload(prev => !prev)}>Toggle Payload JSON</Button>
        {showPayload && (
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1 Summary */}
      <div className="border p-4 rounded">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Student Details</h3>
          <button className="text-blue-500 text-sm" onClick={() => goToStep(1)}>Edit</button>
        </div>
        <p><strong>Full Name:</strong> {data.studentDetails.fullName}</p>
        <p><strong>Email:</strong> {data.studentDetails.email}</p>
        <p><strong>Mobile:</strong> +91 {data.studentDetails.mobile}</p>
        <p><strong>Class:</strong> {data.studentDetails.class}</p>
        <p><strong>Board:</strong> {data.studentDetails.board}</p>
        <p><strong>Preferred Language:</strong> {data.studentDetails.preferredLanguage}</p>
      </div>

      {/* Step 2 Summary */}
      <div className="border p-4 rounded">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Academic Details</h3>
          <button className="text-blue-500 text-sm" onClick={() => goToStep(2)}>Edit</button>
        </div>
        <pre>{JSON.stringify(data.academicDetails, null, 2)}</pre>
      </div>

      {/* Step 3 Summary */}
      <div className="border p-4 rounded">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Address & Guardian</h3>
          <button className="text-blue-500 text-sm" onClick={() => goToStep(3)}>Edit</button>
        </div>
        <p><strong>PIN Code:</strong> {data.addressGuardian.pinCode}</p>
        <p><strong>State:</strong> {data.addressGuardian.state}</p>
        <p><strong>City:</strong> {data.addressGuardian.city}</p>
        <p><strong>Address Line:</strong> {data.addressGuardian.addressLine}</p>
        <p><strong>Guardian Name:</strong> {data.addressGuardian.guardianName}</p>
        <p><strong>Guardian Mobile:</strong> +91 {data.addressGuardian.guardianMobile}</p>
        <p><strong>Payment Plan:</strong> {data.addressGuardian.preferredPaymentPlan}</p>
        <p><strong>Payment Mode:</strong> {data.addressGuardian.paymentMode}</p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Previous</Button>
        <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Enrollment'}</Button>
      </div>
    </div>
  );
}
