'use client';
import { useSearchParams } from 'next/navigation';
import EnrollmentForm from '@/app/dashboard/overview/_components/enrollment/EnrollmentForm';

export default function EnrollPage() {
  const searchParams = useSearchParams();
  const bookKey = searchParams.get('bookKey') || '';
  const bookTitle = searchParams.get('bookTitle') || '';

  return <EnrollmentForm bookKey={bookKey} bookTitle={bookTitle} />;
}
