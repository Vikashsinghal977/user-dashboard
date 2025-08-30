'use client';

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// ----- Zod Schema -----
const academicSchema = z.object({
  class: z.enum(["9", "10", "11", "12"]),
  subjects: z.array(z.string()),
  examGoal: z.enum(["Board Excellence", "Concept Mastery", "Competitive Prep"]),
  weeklyStudyHours: z.number().min(1).max(40),
  scholarship: z.boolean(),
  lastExamPercentage: z.number().min(0).max(100).optional(),
  achievements: z.string().optional(),
}).refine(data => {
  // Validate subjects count based on class
  if (data.class === "9" || data.class === "10") {
    if (data.subjects.length < 2) return false;
  }
  if (data.class === "11" || data.class === "12") {
    if (data.subjects.length < 3) return false;
  }
  // scholarship conditional
  if (data.scholarship && data.lastExamPercentage === undefined) return false;
  return true;
}, {
  message: "Select at least 2 subjects for Class 9–10, 3 for Class 11–12. Last Exam Percentage is required for scholarship.",
  path: ["subjects"]
});

// ----- Form Component -----
export default function AcademicStep() {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      class: "10",
      subjects: [],
      examGoal: undefined,
      weeklyStudyHours: 5,
      scholarship: false,
      lastExamPercentage: undefined,
      achievements: ""
    }
  });

  const watchClass = watch("class");
  const watchScholarship = watch("scholarship");

  const subjectsOptions: Record<string, string[]> = {
    "9": ["English", "Mathematics", "Science", "Social Science", "Hindi/Sanskrit"],
    "10": ["English", "Mathematics", "Science", "Social Science", "Hindi/Sanskrit"],
    "11": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"],
    "12": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"]
  }

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      
      {/* Class */}
      <label className="block">
        Class
        <select {...register("class")} className="mt-1 block w-full border p-2 rounded">
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </label>

      {/* Subjects (Multi-Select) */}
      <Controller
        control={control}
        name="subjects"
        render={({ field }) => (
          <div className="space-y-2">
            {subjectsOptions[watchClass].map(sub => (
              <label key={sub} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={sub}
                  checked={field.value?.includes(sub)}
                  onChange={e => {
                    if (e.target.checked) {
                      field.onChange([...(field.value || []), sub]);
                    } else {
                      field.onChange((field.value || []).filter((s: string) => s !== sub));
                    }
                  }}
                />
                <span>{sub}</span>
              </label>
            ))}
          </div>
        )}
      />
      {errors.subjects && <p className="text-red-500">{errors.subjects.message}</p>}

      {/* Exam Goal */}
      <label className="block">
        Exam Goal
        <select {...register("examGoal")} className="mt-1 block w-full border p-2 rounded">
          <option value="">Select Goal</option>
          <option value="Board Excellence">Board Excellence</option>
          <option value="Concept Mastery">Concept Mastery</option>
          <option value="Competitive Prep">Competitive Prep</option>
        </select>
        {errors.examGoal && <p className="text-red-500">{errors.examGoal.message}</p>}
      </label>

      {/* Weekly Study Hours */}
      <label className="block">
        Weekly Study Hours
        <input type="number" {...register("weeklyStudyHours", { valueAsNumber: true })} className="mt-1 block w-full border p-2 rounded" min={1} max={40} />
        {errors.weeklyStudyHours && <p className="text-red-500">{errors.weeklyStudyHours.message}</p>}
      </label>

      {/* Scholarship Toggle */}
      <label className="flex items-center space-x-2">
        <Checkbox {...register("scholarship")} />
        <span>Applying for Scholarship?</span>
      </label>

      {/* Conditional Scholarship Fields */}
      {watchScholarship && (
        <>
          <label className="block">
            Last Exam Percentage
            <input type="number" {...register("lastExamPercentage", { valueAsNumber: true })} className="mt-1 block w-full border p-2 rounded" min={0} max={100} />
            {errors.lastExamPercentage && <p className="text-red-500">{errors.lastExamPercentage.message}</p>}
          </label>

          <label className="block">
            Achievements
            <Textarea {...register("achievements")} placeholder="Optional achievements..." />
          </label>
        </>
      )}

      <Button type="submit">Next</Button>
    </form>
  );
}
