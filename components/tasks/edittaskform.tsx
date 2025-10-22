import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

import type { EditableTaskFields } from "@/types/types";

type Props = {
  editForm: EditableTaskFields;
  onChange: (field: keyof EditableTaskFields, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
};

// type Props = {
//   editForm: any;
//   onChange: (field: string, value: string) => void;
//   onSave: () => void;
//   onCancel: () => void;
//   className?: string;
// };

const EditTaskForm: React.FC<Props> = ({
  editForm,
  onChange,
  onSave,
  onCancel,
  className,
}) => {
  return (
    <div className={cn("md:p-8 space-y-3 mb-1 text-sm", className)}>
      <>
        <label htmlFor="" className="font-semibold">
          Title
        </label>
        <input
          type="text"
          value={editForm.name ?? ""}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full border p-2 mt-2 rounded-md"
          placeholder="Task name"
        />
      </>
      <>
        <label htmlFor="" className="font-semibold">
          Description
        </label>
        <textarea
          value={editForm.description ?? ""}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full border p-2 mt-2 rounded-md min-h-32"
          placeholder="Description"
        />
      </>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-sm block mb-1">Priority</label>
          <select
            value={editForm.priority}
            onChange={(e) => onChange("priority", e.target.value)}
            className="w-full border p-2"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="text-sm block mb-1">Tag</label>
          <input
            type="text"
            value={(editForm.tags && editForm.tags.join(", ")) ?? ""}
            onChange={(e) => onChange("tags", e.target.value)}
            className="w-full border p-2"
            placeholder="Tags"
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Status</label>
          <select
            value={editForm.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="w-full border p-2"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default EditTaskForm;
