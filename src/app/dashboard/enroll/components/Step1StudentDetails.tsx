'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  class: z.enum(['9', '10', '11', '12']),
  board: z.enum(['CBSE', 'ICSE', 'State Board']),
  preferredLanguage: z.enum(['English', 'Hindi', 'Hinglish']),
});

type StudentFormData = z.infer<typeof studentSchema>;

// ----------------- Component -----------------
export default function Step1StudentDetails({ data, update, nextStep }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: data,
  });

  const onSubmit = (values: StudentFormData) => {
    update(values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <Input placeholder="John Doe" {...register('fullName')} />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <Input type="email" placeholder="example@mail.com" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label className="block mb-1 font-medium">Mobile (+91)</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
          <Input
            type="tel"
            placeholder="9876543210"
            {...register('mobile')}
            className="rounded-l-none"
          />
        </div>
        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
      </div>

      {/* Class */}
      <div>
        <label className="block mb-1 font-medium">Class</label>
        <Select {...register('class')}>
          <SelectTrigger>
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="11">11</SelectItem>
            <SelectItem value="12">12</SelectItem>
          </SelectContent>
        </Select>
        {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>}
      </div>

      {/* Board */}
      <div>
        <label className="block mb-1 font-medium">Board</label>
        <Select {...register('board')}>
          <SelectTrigger>
            <SelectValue placeholder="Select Board" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CBSE">CBSE</SelectItem>
            <SelectItem value="ICSE">ICSE</SelectItem>
            <SelectItem value="State Board">State Board</SelectItem>
          </SelectContent>
        </Select>
        {errors.board && <p className="text-red-500 text-sm mt-1">{errors.board.message}</p>}
      </div>

      {/* Preferred Language */}
      <div>
        <label className="block mb-1 font-medium">Preferred Language</label>
        <Select {...register('preferredLanguage')}>
          <SelectTrigger>
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Hindi">Hindi</SelectItem>
            <SelectItem value="Hinglish">Hinglish</SelectItem>
          </SelectContent>
        </Select>
        {errors.preferredLanguage && <p className="text-red-500 text-sm mt-1">{errors.preferredLanguage.message}</p>}
      </div>

      <Button type="submit">Next</Button>
    </form>
  );
}
