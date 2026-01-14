'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';

type Job = {
  id: string;
  name: string;
  jobPosition: string;
  category: string;
  createdAt: string;
};

type JobsResponse = {
  data: Job[];
  nextPage: number | null;
  hasMore: boolean;
};

// type SortType = 'latest' | 'oldest' | 'az';

function JobCardSkeleton() {
  return (
    <div className="block border rounded p-4 space-y-1 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}

export default function HomePage() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  type SortType = 'newest' | 'oldest' | 'az';
  const [sort, setSort] = useState<SortType>('newest');
  const handleSearch = () => {
    setSearchQuery(search);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['jobs', searchQuery, category],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: '5',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (category) params.append('category', category);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch jobs');
      }

      return res.json() as Promise<JobsResponse>;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const sortedJobs = useMemo(() => {
  if (!data) return [];

  const allJobs = data.pages.flatMap((page) => page.data);

  return [...allJobs].sort((a, b) => {
    if (sort === 'az') {
      return a.jobPosition.localeCompare(b.jobPosition);
    }

    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return sort === 'newest'
      ? dateB - dateA
      : dateA - dateB;
  });
}, [data, sort]);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (status === 'pending') {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <div className="px-4 py-2 bg-gray-200 rounded w-32 h-10 animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="border p-2 rounded flex-1 h-10 bg-gray-200 animate-pulse"></div>
          <div className="border p-2 rounded w-40 h-10 bg-gray-200 animate-pulse"></div>
          <div className="border p-2 rounded w-40 h-10 bg-gray-200 animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return <p className="p-6 text-red-500">Failed to load jobs</p>;
  }

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <Link
          href="/jobs/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Job
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <input
            placeholder="Search by name, position, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded flex-1 md:flex-none md:w-40"
          >
            <option value="">All Categories</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="border p-2 rounded flex-1 md:flex-none md:w-40"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z (Job)</option>
          </select>
        </div>
      </div>

      {sortedJobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="block border rounded p-4 space-y-1 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold">{job.jobPosition}</h2>
          <p className="text-sm">{job.name}</p>
          <p className="text-xs text-gray-500">{job.category}</p>
        </Link>
      ))}

      {sortedJobs.length === 0 && (
        <p className="text-center text-gray-500 py-8">No jobs found</p>
      )}

      <div ref={loadMoreRef} />

      {isFetchingNextPage && (
        <div className="space-y-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      )}
    </div>
  );
}
