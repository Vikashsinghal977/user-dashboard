'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ----------------- Zod Schema -----------------
const addressGuardianSchema = z.object({
  pinCode: z.string().regex(/^\d{6}$/, 'PIN Code must be 6 digits'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  addressLine: z.string().min(10, 'Address must be at least 10 characters').max(120, 'Address can be max 120 characters'),
  guardianName: z.string().min(2, 'Guardian Name is required'),
  guardianMobile: z.string().regex(/^[6-9]\d{9}$/, 'Mobile must be a valid 10-digit Indian number'),
  preferredPaymentPlan: z.enum(['Quarterly', 'Half-Yearly', 'Annual']),
  paymentMode: z.enum(['UPI', 'Card', 'NetBanking']),
});

type AddressGuardianFormData = z.infer<typeof addressGuardianSchema>;

// ----------------- Component -----------------
export default function Step3AddressGuardian({ data, update, nextStep, prevStep }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressGuardianFormData>({
    resolver: zodResolver(addressGuardianSchema),
    defaultValues: data,
  });

  const onSubmit = (values: AddressGuardianFormData) => {
    update(values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* PIN Code */}
      <div>
        <label className="block mb-1 font-medium">PIN Code</label>
        <Input type="text" placeholder="110001" {...register('pinCode')} />
        {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
      </div>

      {/* State / UT */}
      <div>
        <label className="block mb-1 font-medium">State / UT</label>
        <Input placeholder="Delhi" {...register('state')} />
        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block mb-1 font-medium">City</label>
        <Input placeholder="New Delhi" {...register('city')} />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
      </div>

      {/* Address Line */}
      <div>
        <label className="block mb-1 font-medium">Address Line</label>
        <Input placeholder="123 Street Name, Area" {...register('addressLine')} />
        {errors.addressLine && <p className="text-red-500 text-sm mt-1">{errors.addressLine.message}</p>}
      </div>

      {/* Guardian Name */}
      <div>
        <label className="block mb-1 font-medium">Guardian Name</label>
        <Input placeholder="Rahul Kumar" {...register('guardianName')} />
        {errors.guardianName && <p className="text-red-500 text-sm mt-1">{errors.guardianName.message}</p>}
      </div>

      {/* Guardian Mobile */}
      <div>
        <label className="block mb-1 font-medium">Guardian Mobile (+91)</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
          <Input
            type="tel"
            placeholder="9876543210"
            {...register('guardianMobile')}
            className="rounded-l-none"
          />
        </div>
        {errors.guardianMobile && <p className="text-red-500 text-sm mt-1">{errors.guardianMobile.message}</p>}
      </div>

      {/* Preferred Payment Plan */}
      <div>
        <label className="block mb-1 font-medium">Preferred Payment Plan</label>
        <Select {...register('preferredPaymentPlan')}>
          <SelectTrigger>
            <SelectValue placeholder="Select Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Quarterly">Quarterly</SelectItem>
            <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
            <SelectItem value="Annual">Annual</SelectItem>
          </SelectContent>
        </Select>
        {errors.preferredPaymentPlan && <p className="text-red-500 text-sm mt-1">{errors.preferredPaymentPlan.message}</p>}
      </div>

      {/* Payment Mode */}
      <div>
        <label className="block mb-1 font-medium">Payment Mode Preference</label>
        <Select {...register('paymentMode')}>
          <SelectTrigger>
            <SelectValue placeholder="Select Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="NetBanking">NetBanking</SelectItem>
          </SelectContent>
        </Select>
        {errors.paymentMode && <p className="text-red-500 text-sm mt-1">{errors.paymentMode.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
