import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { isAxiosError } from "axios";

import type {
  CreateTaskRequest,
  Priority,
  createTaskResponse,
  Status,
} from "@/types/types";

import FieldInfo from "@/components/fieldinfo";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onCreateTask: (task: CreateTaskRequest) => Promise<createTaskResponse>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const TaskFormModal: React.FC<Props> = ({
  onCreateTask,
  isOpen,
  setIsOpen,
}) => {
  const [error, setError] = useState<string>("");

  // const form = useForm<CreateTaskRequest>({
  //   defaultValues: {
  //     name: "",
  //     description: "",
  //     tags: [],
  //     priority: "LOW",
  //   },
  //   onSubmit: async ({ value }) => {
  //     try {
  //       // Ensure all required fields are present and valid
  //       const taskData = {
  //         name: value.name?.trim() || "",
  //         description: value.description?.trim() || null,
  //         tags: value.tags && value.tags.length > 0 ? value.tags : null,
  //         priority: value.priority || "LOW",
  //         status: "TODO", // This must be included as a required field
  //         archived: false,
  //       };

  //       // Validate required fields before sending
  //       if (!taskData.name) {
  //         setError("Task name is required");
  //         return;
  //       }

  //       // Debug logging - remove this in production
  //       console.log("Submitting task data:", taskData);

  //       await onCreateTask(taskData);
  //       setIsOpen(false);
  //       form.reset();
  //       setError("");
  //     } catch (error) {
  //       const err = error as AxiosError<{ message?: string; error?: any }>;

  //       // Debug logging - remove this in production
  //       console.error("Task creation error:", err.response?.data);

  //       // Handle Zod validation errors specifically
  //       let errorMessage = "Error creating task: ";
  //       if (err.response?.data?.error?.issues) {
  //         const zodErrors = err.response.data.error.issues
  //           .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
  //           .join("; ");
  //         errorMessage += zodErrors;
  //       } else if (err.response?.data?.message) {
  //         errorMessage += err.response.data.message;
  //       } else {
  //         errorMessage += err.message;
  //       }

  //       setError(errorMessage);
  //     }
  //   },
  // });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      priority: "LOW",
    } as CreateTaskRequest,
    onSubmit: async ({ value }) => {
      try {
        const taskData = {
          name: value.name?.trim() || "",
          description: value.description?.trim() || null,
          tags: value.tags && value.tags.length > 0 ? value.tags : null,
          priority: value.priority || "LOW",
          status: "TODO" as Status,
          archived: false,
        };

        if (!taskData.name) {
          setError("Task name is required");
          return;
        }

        await onCreateTask(taskData);
        setIsOpen(false);
        form.reset();
        setError("");
      } catch (error: unknown) {
        if (
          isAxiosError<{
            message?: string;
            error?: { issues?: { path: string[]; message: string }[] };
          }>(error)
        ) {
          // now 'error' is fully typed as AxiosError with a known data shape
          const errData = error.response?.data;

          let errorMessage = "Error creating task: ";

          if (errData?.error?.issues) {
            const zodErrors = errData.error.issues
              .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
              .join("; ");
            errorMessage += zodErrors;
          } else if (errData?.message) {
            errorMessage += errData.message;
          } else {
            errorMessage += error.message;
          }

          setError(errorMessage);
        } else {
          // For non-Axios errors (e.g., network issues)
          setError(
            error instanceof Error ? error.message : "Unknown error occurred"
          );
        }
      }
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    form.reset();
  };

  return (
    <div>
      {isOpen && (
        <div
          className="fixed top-0 left-0 z-50 right-0 bottom-0 flex justify-center items-center bg-[rgba(0,0,0,0.4)] dark:bg-[rgba(0,0,0,0.7)]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <form
              onSubmit={handleFormSubmit}
              className="bg-background w-138 max-w-[60%] md:max-w-[80%] mx-auto min-h-[50vh] rounded-2xl p-5 md:p-10 space-y-3 mb-6 text-sm shadow-2xl backdrop-blur-3xl"
            >
              <div>
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "A title is required"
                        : value.length < 2
                        ? "Title must be at least 2 characters"
                        : undefined,
                  }}
                >
                  {(field) => {
                    return (
                      <>
                        <label htmlFor={field.name}>Task title</label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Task name"
                          className="w-full p-2 border rounded-md mt-1 bg-transparent"
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>
              </div>

              <div>
                <form.Field name="description">
                  {(field) => {
                    return (
                      <>
                        <label htmlFor={field.name}>Task description</label>
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          rows={4}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Task description (optional)"
                          className="w-full p-2 border rounded-md mt-1 bg-transparent"
                        />
                      </>
                    );
                  }}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="tags">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={field.name}>Task tag</label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value?.join(", ") || ""}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="e.g., work, personal"
                        className="w-full p-2 border rounded-md mt-1 bg-transparent"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="priority">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={field.name}>Priority</label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val) =>
                          field.handleChange(val as Priority)
                        }
                      >
                        <SelectTrigger className="w-full p-2 border rounded-md mt-1">
                          <SelectValue placeholder="Select priority for your task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
              </div>

              {error && (
                <div className="border border-red-600 bg-red-200 p-2 text-red-900 rounded">
                  <p>{error}</p>
                </div>
              )}

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <div className="flex justify-between mt-5">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? "Adding..." : "+ Add Task"}
                    </Button>
                  </div>
                )}
              </form.Subscribe>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFormModal;
