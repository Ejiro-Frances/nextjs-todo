"use client";

import Header from "@/components/header";
import TaskList from "@/components/tasks/tasklist";

const AllTasks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto py-10">
        <TaskList />
      </main>
    </div>
  );
};

export default AllTasks;
