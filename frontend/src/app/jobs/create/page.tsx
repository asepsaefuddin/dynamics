'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { jobSchema, type JobInput } from '@/app/lib/schemas';

export default function CreateJobPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobInput) => {
    setServerError('');
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create job');
      router.push('/');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to create job');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Jobs
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create New Job</h1>

      {serverError && <p className="mb-4 text-red-600">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Position</label>
          <input
            type="text"
            {...register('jobPosition')}
            className="w-full border rounded px-3 py-2"
          />
          {errors.jobPosition && <p className="text-red-600 text-sm mt-1">{errors.jobPosition.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            {...register('category')}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}