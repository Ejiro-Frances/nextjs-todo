"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ErrorBoundary({ error }: { error: Error }) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Next.js App Router way to refresh
      router.refresh();
    } catch {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-2">
        💥 Oops! Something went wrong
      </h1>

      <p className="text-red-500 text-lg font-medium">
        {error?.message || "Unexpected error occurred."}
      </p>
      <p className="text-sm text-gray-700 italic mb-4">
        {error?.name || "UnknownError"}
      </p>

      <button
        onClick={() => setShowErrorDetails((prev) => !prev)}
        className="text-red-600 underline mb-4 hover:text-blue-800 text-sm"
      >
        {showErrorDetails ? "Hide error details" : "Show error details"}
      </button>

      {showErrorDetails && (
        <pre className="text-xs text-left bg-gray-100 p-4 rounded w-full overflow-auto max-h-80 text-gray-700 whitespace-pre-wrap">
          {error?.stack || "No stack trace available."}
        </pre>
      )}

      {isRetrying ? (
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40 rounded-full bg-gray-200" />
          <Skeleton className="h-5 w-32 rounded-full bg-gray-200" />
          <Skeleton className="h-4 w-20 rounded-full bg-gray-200" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 mt-5">
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
          <Link
            href="/all-tasks"
            className="text-sm text-blue-600 underline hover:text-blue-700"
          >
            Go Home
          </Link>
        </div>
      )}
    </div>
  );
}
