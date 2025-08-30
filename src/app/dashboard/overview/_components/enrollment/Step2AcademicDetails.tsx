'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';

// ----------------- Zod Schema -----------------
const academicSchema = z.object({
  class: z.enum(["9", "10", "11", "12"], {
    message: 'Please select a class'
  }),
  subjects: z.array(z.string()).min(1, 'Please select at least one subject'),
  examGoal: z.enum(["Board Excellence", "Concept Mastery", "Competitive Prep"], {
    message: 'Please select an exam goal'
  }),
  weeklyStudyHours: z.number().min(1, 'Weekly study hours must be at least 1').max(40, 'Weekly study hours cannot exceed 40'),
  scholarship: z.boolean(),
  lastExamPercentage: z.number().min(0, 'Percentage must be at least 0').max(100, 'Percentage cannot exceed 100').optional(),
  achievements: z.string().optional(),
}).refine(data => {
  // Validate subjects count based on class
  if (data.class === "9" || data.class === "10") {
    if (data.subjects.length < 2) return false;
  }
  if (data.class === "11" || data.class === "12") {
    if (data.subjects.length < 3) return false;
  }
  return true;
}, {
  message: "Select at least 2 subjects for Class 9–10, 3 for Class 11–12",
  path: ["subjects"]
}).refine(data => {
  // Scholarship conditional validation
  if (data.scholarship && (data.lastExamPercentage === undefined || data.lastExamPercentage === null)) {
    return false;
  }
  return true;
}, {
  message: "Last Exam Percentage is required when applying for scholarship",
  path: ["lastExamPercentage"]
});

type AcademicFormData = z.infer<typeof academicSchema>;

// ----------------- Component -----------------
interface AcademicStepProps {
  data?: Partial<AcademicFormData>;
  update?: (data: AcademicFormData) => void;
  nextStep?: () => void;
  bookKey?: string;
  prevStep?: () => void;
}

export default function AcademicStep({ data, update, nextStep, bookKey, prevStep }: AcademicStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AcademicFormData>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      class: data?.class || undefined,
      subjects: data?.subjects || [],
      examGoal: data?.examGoal || undefined,
      weeklyStudyHours: data?.weeklyStudyHours || 5,
      scholarship: data?.scholarship || false,
      lastExamPercentage: data?.lastExamPercentage || undefined,
      achievements: data?.achievements || '',
    }
  });

  const watchClass = form.watch("class");
  const watchScholarship = form.watch("scholarship");
  const watchSubjects = form.watch("subjects");

  const subjectsOptions: Record<string, string[]> = {
    "9": ["English", "Mathematics", "Science", "Social Science", "Hindi/Sanskrit"],
    "10": ["English", "Mathematics", "Science", "Social Science", "Hindi/Sanskrit"],
    "11": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"],
    "12": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"]
  };

  async function onSubmit(formData: AcademicFormData) {
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
      
      console.log('Academic form submitted successfully:', formData);
    } catch (error) {
      console.error('Error submitting academic form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const currentSubjects = watchSubjects || [];
    if (checked) {
      form.setValue("subjects", [...currentSubjects, subject]);
    } else {
      form.setValue("subjects", currentSubjects.filter(s => s !== subject));
    }
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Step 2 - Academic Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
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

              {/* Subjects Multi-Select */}
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Subjects * 
                      <span className="text-sm text-gray-500 ml-2">
                        (Select at least {watchClass === "9" || watchClass === "10" ? "2" : "3"} subjects)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 p-4 border rounded-md">
                        {watchClass && subjectsOptions[watchClass]?.map((subject) => (
                          <div key={subject} className="flex items-center space-x-2">
                            <Checkbox
                              id={subject}
                              checked={watchSubjects?.includes(subject) || false}
                              onCheckedChange={(checked) => 
                                handleSubjectChange(subject, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={subject}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {subject}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exam Goal */}
              <FormField
                control={form.control}
                name="examGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Goal *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your exam goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Board Excellence">Board Excellence</SelectItem>
                        <SelectItem value="Concept Mastery">Concept Mastery</SelectItem>
                        <SelectItem value="Competitive Prep">Competitive Prep</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weekly Study Hours */}
              <FormField
                control={form.control}
                name="weeklyStudyHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Study Hours *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter weekly study hours"
                        min={1}
                        max={40}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scholarship Checkbox */}
              <FormField
                control={form.control}
                name="scholarship"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Applying for Scholarship?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Conditional Scholarship Fields */}
              {watchScholarship && (
                <>
                  {/* Last Exam Percentage */}
                  <FormField
                    control={form.control}
                    name="lastExamPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Exam Percentage *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="Enter your last exam percentage"
                            min={0}
                            max={100}
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Achievements */}
                  <FormField
                    control={form.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievements (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your academic achievements, awards, competitions, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

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