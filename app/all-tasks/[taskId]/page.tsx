"use client";

import { useQuery } from "@tanstack/react-query";
import { getTask } from "@/services/taskservices";
import TaskDetailsCard from "@/components/tasks/taskdetailcard";
import Header from "@/components/header/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = Array.isArray(params.taskId)
    ? params.taskId[0]
    : params.taskId;

  const {
    data: taskResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId as string),
    enabled: !!taskId,
  });

  const task = taskResponse?.data;

  // ✅ Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="max-w-[90%] mx-auto pt-24">
          <BreadcrumbSection id={taskId} />
          <div className="bg-gray-50 dark:bg-gray-600 rounded-xl p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </main>
      </>
    );
  }

  // ❌ Error or not found
  if (isError || !task) {
    return (
      <>
        <Header />
        <main className="max-w-[90%] mx-auto pt-24">
          <BreadcrumbSection id={taskId} />
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-red-800 font-semibold mb-2">Task Not Found</h2>
            <p className="text-red-600">
              The task you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            {error && (
              <details className="mt-4">
                <summary className="text-red-700 cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </main>
      </>
    );
  }

  // ✅ Success
  return (
    <>
      <Header />
      <main className="max-w-[95%] mx-auto">
        <div className="flex items-center gap-2 mb-6 fixed top-8 left-0 bg-white w-full pt-14 pb-3 pl-5 shadow-sm z-10">
          <BreadcrumbSection id={taskId} />
        </div>

        <div className="pt-24">
          <TaskDetailsCard task={task} />
        </div>
      </main>
    </>
  );
}

// ✅ Small breadcrumb helper component
function BreadcrumbSection({ id }: { id?: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/all-tasks">Tasks</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/all-tasks/${id}`}>
              Task detail
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
