import { NextRequest, NextResponse } from 'next/server';

// Mock task data - in a real app, this would come from a database
const mockTasks = [
  {
    id: "1",
    name: "Sample Task 1",
    description: "This is a sample task description",
    priority: "HIGH" as const,
    status: "TODO" as const,
    archived: false,
    parentId: null,
    children: [],
    tags: "work,urgent",
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2", 
    name: "Sample Task 2",
    description: "Another sample task",
    priority: "MEDIUM" as const,
    status: "IN_PROGRESS" as const,
    archived: false,
    parentId: null,
    children: [],
    tags: "personal",
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Completed Task",
    description: "This task is done",
    priority: "LOW" as const,
    status: "DONE" as const,
    archived: false,
    parentId: null,
    children: [],
    tags: "completed",
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    
    // Find the task by ID
    const task = mockTasks.find(t => t.id === taskId);
    
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
