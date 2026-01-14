'use server';

import { jobSchema } from '@/app/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function createJob(_: unknown, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    jobPosition: formData.get('jobPosition'),
    category: formData.get('category'),
  };

  const parsed = jobSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    return { success: false };
  }

  revalidatePath('/');

  return { success: true };
}
