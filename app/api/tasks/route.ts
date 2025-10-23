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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredTasks = [...mockTasks];

    // Filter by status
    if (status && status !== 'ALL') {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.tags && task.tags.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredTasks.length / limit);

    return NextResponse.json({
      data: paginatedTasks,
      meta: {
        total: filteredTasks.length,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTask = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || null,
      priority: body.priority || "LOW",
      status: body.status || "TODO",
      archived: body.archived || false,
      parentId: null,
      children: [],
      tags: body.tags || null,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, you would save this to a database
    mockTasks.unshift(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
