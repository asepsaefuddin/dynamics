import Link from 'next/link';

type Job = {
  id: string;
  name: string;
  jobPosition: string;
  category: string;
  createdAt: string;
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${id}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return <p className="p-6 text-red-500">Job not found</p>;
  }

  const result = await res.json();
  const job: Job = result.data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition"
        >
          <span>←</span>
          <span>Back to Jobs</span>
        </Link>

        {/* Job Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          {/* Header */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">{job.jobPosition}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {job.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="font-semibold text-gray-700 w-32">Company:</span>
              <span className="text-gray-900">{job.name}</span>
            </div>

            <div className="flex items-start">
              <span className="font-semibold text-gray-700 w-32">Category:</span>
              <span className="text-gray-900">{job.category}</span>
            </div>

            <div className="flex items-start">
              <span className="font-semibold text-gray-700 w-32">Posted:</span>
              <span className="text-gray-600">
                {new Date(job.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
