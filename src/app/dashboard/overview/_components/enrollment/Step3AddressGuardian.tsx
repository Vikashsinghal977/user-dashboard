'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';

// ----------------- Zod Schema -----------------
const addressGuardianSchema = z.object({
  pinCode: z
    .string()
    .regex(/^\d{6}$/, 'PIN Code must be exactly 6 digits')
    .min(1, 'PIN Code is required'),
  state: z
    .string()
    .min(2, 'State is required')
    .max(50, 'State name is too long')
    .regex(/^[A-Za-z ]+$/, 'State can only contain letters and spaces')
    .transform((val) => val.trim()),
  city: z
    .string()
    .min(2, 'City is required')
    .max(50, 'City name is too long')
    .regex(/^[A-Za-z ]+$/, 'City can only contain letters and spaces')
    .transform((val) => val.trim()),
  addressLine: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(120, 'Address can be maximum 120 characters')
    .transform((val) => val.trim()),
  guardianName: z
    .string()
    .min(2, 'Guardian Name must be at least 2 characters')
    .max(60, 'Guardian Name must be at most 60 characters')
    .regex(/^[A-Za-z ]+$/, 'Guardian Name can only contain letters and spaces')
    .transform((val) => val.trim()),
  guardianMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Mobile must be a valid 10-digit Indian number'),
  preferredPaymentPlan: z.enum(['Quarterly', 'Half-Yearly', 'Annual'], {
     message: 'Please select a payment plan'
  }),
  paymentMode: z.enum(['UPI', 'Card', 'NetBanking'], {
     message: 'Please select a payment mode'
  }),
});

type AddressGuardianFormData = z.infer<typeof addressGuardianSchema>;

// ----------------- Component -----------------
interface Step3AddressGuardianProps {
  data?: Partial<AddressGuardianFormData>;
  update?: (data: AddressGuardianFormData) => void;
  nextStep?: () => void;
  prevStep?: () => void;
  bookKey?: string;
}

export default function Step3AddressGuardian({ 
  data, 
  update, 
  bookKey,
  nextStep, 
  prevStep 
}: Step3AddressGuardianProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressGuardianFormData>({
    resolver: zodResolver(addressGuardianSchema),
    defaultValues: {
      pinCode: data?.pinCode || '',
      state: data?.state || '',
      city: data?.city || '',
      addressLine: data?.addressLine || '',
      guardianName: data?.guardianName || '',
      guardianMobile: data?.guardianMobile || '',
      preferredPaymentPlan: data?.preferredPaymentPlan || undefined,
      paymentMode: data?.paymentMode || undefined,
    }
  });

  async function onSubmit(formData: AddressGuardianFormData) {
    setIsSubmitting(true);
    try {
      // Call the update function if provided
      if (update) {
        update(formData);
      }
      
      // Move to next step if provided
      if (nextStep) {
        nextStep();
      }
      
      console.log('Address & Guardian form submitted successfully:', formData);
    } catch (error) {
      console.error('Error submitting address & guardian form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Step 3 - Address & Guardian Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Address Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-left text-lg font-semibold">
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* PIN Code */}
                  <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN Code *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="110001"
                            maxLength={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / UT *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your state"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your city"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address Line */}
                  <FormField
                    control={form.control}
                    name="addressLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="House No., Street Name, Area, Landmark"
                            maxLength={120}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Guardian Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-left text-lg font-semibold">
                    Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Guardian Name */}
                  <FormField
                    control={form.control}
                    name="guardianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guardian Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter guardian's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Guardian Mobile with +91 prefix */}
                  <FormField
                    control={form.control}
                    name="guardianMobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guardian Mobile Number *</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-500">
                              +91
                            </div>
                            <Input 
                              placeholder="Enter 10-digit mobile number"
                              className="rounded-l-none"
                              maxLength={10}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-left text-lg font-semibold">
                    Payment Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Preferred Payment Plan */}
                  <FormField
                    control={form.control}
                    name="preferredPaymentPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Payment Plan *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Quarterly">Quarterly (Every 3 months)</SelectItem>
                            <SelectItem value="Half-Yearly">Half-Yearly (Every 6 months)</SelectItem>
                            <SelectItem value="Annual">Annual (Yearly)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Mode */}
                  <FormField
                    control={form.control}
                    name="paymentMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Mode Preference *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UPI">UPI (PhonePe, Google Pay, etc.)</SelectItem>
                            <SelectItem value="Card">Debit/Credit Card</SelectItem>
                            <SelectItem value="NetBanking">Net Banking</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  Previous Step
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Continue to Next Step'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}