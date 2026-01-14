'use client';

import { useActionState } from 'react';
import { createJob } from './actions';

const initialState = {
  success: false,
  errors: {},
};

export default function CreateJobPage() {
  const [state, formAction] = useActionState(createJob, initialState);

  return (
    <form action={formAction} className="p-6 space-y-4 max-w-md">
      <h1 className="text-xl font-bold">Create Job</h1>

      <input
        name="name"
        placeholder="Name"
        className="border p-2 w-full"
      />
      {state.errors?.name && (
        <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
      )}

      <input
        name="jobPosition"
        placeholder="Job Position"
        className="border p-2 w-full"
      />
      {state.errors?.jobPosition && (
        <p className="text-red-500 text-sm">{state.errors.jobPosition[0]}</p>
      )}

      <input
        name="category"
        placeholder="Category"
        className="border p-2 w-full"
      />
      {state.errors?.category && (
        <p className="text-red-500 text-sm">{state.errors.category[0]}</p>
      )}

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {state.success && (
        <p className="text-green-600">Job created successfully</p>
      )}
    </form>
  );
}
