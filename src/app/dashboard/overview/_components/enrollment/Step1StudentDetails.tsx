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
const studentSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full Name must be at least 2 characters')
    .max(60, 'Full Name must be at most 60 characters')
    .regex(/^[A-Za-z ]+$/, 'Full Name can only contain letters and spaces')
    .transform((val) => val.trim()),
  email: z.string().email('Invalid email'),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Mobile must be a valid 10-digit Indian number'),
  class: z.enum(['9', '10', '11', '12'], {
    error: 'Please select a class'
  }),
  board: z.enum(['CBSE', 'ICSE', 'State Board'], {
    error: 'Please select a board'
  }),
  preferredLanguage: z.enum(['English', 'Hindi', 'Hinglish'], {
    message: 'Please select a preferred language'
  }),
});

type StudentFormData = z.infer<typeof studentSchema>;

// ----------------- Component -----------------
interface Step1StudentDetailsProps {
  data?: Partial<StudentFormData>;
  update?: (data: StudentFormData) => void;
  nextStep?: () => void;
  bookKey?: any
}

export default function Step1StudentDetails({ data, update, nextStep, bookKey }: Step1StudentDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: data?.fullName || '',
      email: data?.email || '',
      mobile: data?.mobile || '',
      class: data?.class || undefined,
      board: data?.board || undefined,
      preferredLanguage: data?.preferredLanguage || undefined,
    }
  });

  async function onSubmit(formData: StudentFormData) {
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
      
      console.log('Form submitted successfully:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Step 1 - Student Details Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Full Name Field */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile Field with +91 prefix */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
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

              {/* Class Field */}
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="9">Class 9</SelectItem>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="11">Class 11</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Board Field */}
              <FormField
                control={form.control}
                name="board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="State Board">State Board</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preferred Language Field */}
              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Language *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Hinglish">Hinglish</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Continue to Next Step'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}