'use client';
import { useState } from 'react';
import Step1StudentDetails from './Step1StudentDetails';
import Step2AcademicDetails from './Step2AcademicDetails';
import Step3AddressGuardian from './Step3AddressGuardian';
import Step4ReviewSubmit from './Step4ReviewSubmit';

export default function EnrollmentForm({bookKey}:any) {
  const [step, setStep] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    studentDetails: {},
    academicDetails: {},
    addressGuardian: {}
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  };

  return (
    <div className="p-4">
      {step === 1 && <Step1StudentDetails bookKey={bookKey} data={formData.studentDetails} update={data => updateFormData('studentDetails', data)} nextStep={nextStep} />}
      {step === 2 && <Step2AcademicDetails bookKey={bookKey} data={formData.academicDetails} update={data => updateFormData('academicDetails', data)} nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3AddressGuardian  bookKey={bookKey} data={formData.addressGuardian} update={data => updateFormData('addressGuardian', data)} nextStep={nextStep} prevStep={prevStep} />}
      {step === 4 && <Step4ReviewSubmit bookKey={bookKey} data={formData} prevStep={prevStep} />}
    </div>
  );
}
